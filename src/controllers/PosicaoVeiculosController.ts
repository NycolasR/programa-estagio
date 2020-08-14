import { Request, Response } from "express";

import database from "../database/connection";
import areTheseObjectsEquals from "../utils/areTheseObjectsEquals";

export default class PosicaoVeiculosController {
  async index(request: Request, response: Response) {
    const { page = 1 } = request.query; // Implementando paginação

    // Usando promisses com funções assíncronas (async await)
    const posicao_veiculos = await database("posicao_veiculo")
      .limit(10) // Limite de elementos por página
      .offset((Number(page) - 1) * 10); // Para fazer o deslocamento do pedido de registros

    return !areTheseObjectsEquals(posicao_veiculos, [])
      ? response.json(posicao_veiculos)
      : response.status(404).json({
          error:
            'Não foi possível encontrar estes registros da tabela "posicao_veiculo". It was not possible to find these records in the "posicao_veiculo" table',
        });
  }

  async indexOneByID(request: Request, response: Response) {
    const { id } = request.params;

    const posicao_veiculo = await database("posicao_veiculo").where(
      "posicao_veiculo.id",
      "=",
      id
    );

    return !areTheseObjectsEquals(posicao_veiculo, [])
      ? response.json(posicao_veiculo)
      : response.status(404).json({
          error:
            'Não foi possível encontrar este registro da tabela "posicao_veiculo". It was not possible to find these record in the "posicao_veiculo" table',
        });
  }

  async create(request: Request, response: Response) {
    const { latitude, longitude, veiculo_id } = request.body; // Usando desestruturação de objetos

    // Usando transaction para inserções mais seguras no banco de dados
    const trx = await database.transaction();

    try {
      await trx("posicao_veiculo").insert({
        latitude,
        longitude,
        veiculo_id, // Usando Object Short Syntax
      });

      // Aplicando as alterações
      await trx.commit();

      return response.status(201).send();
    } catch (err) {
      // Para desfazer as alterações feitas em caso de falha na operação
      await trx.rollback();

      console.error(err);

      return response.status(400).json({
        error:
          'Erro inesperado ao criar um "posicao_veiculo". Unexpected error while creating a new "posicao_veiculo"',
      });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);
      const { latitude, longitude, veiculo_id } = request.body;

      await database("posicao_veiculo")
        .update({ latitude, longitude, veiculo_id })
        .where({ id });

      return response.send();
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Erro inesperado ao atualizar este registro da tabela "posicao_veiculo". Unexpected error while updating um register at "posicao_veiculo" table',
      });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);

      await database("posicao_veiculo").del().where({ id });

      return response.send();
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Erro inesperado ao deletar este registro da tabela "posicao_veiculo". Unexpected error while deleting this register at "posicao_veiculo" table',
      });
    }
  }
}
