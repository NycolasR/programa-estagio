import { Request, Response } from "express";

import database from "../database/connection";
import areTheseObjectsEquals from "../utils/areTheseObjectsEquals";

export default class ParadasController {
  async index(request: Request, response: Response) {
    const { page = 1 } = request.query; // Implementando paginação

    // Usando promisses com funções assíncronas (async await)
    const paradas = await database("parada")
      .limit(10) // Limite de elementos por página
      .offset((Number(page) - 1) * 10); // Para fazer o deslocamento do pedido de registros

    return !areTheseObjectsEquals(paradas, [])
      ? response.json(paradas)
      : response.status(404).json({
          error:
            'Não foi possível encontrar estes registros da tabela "parada". It was not possible to find these records in the "parada" table',
        });
  }

  async indexOneByID(request: Request, response: Response) {
    const { id } = request.params;

    const parada = await database("parada").where("parada.id", "=", id);

    return !areTheseObjectsEquals(parada, [])
      ? response.json(parada)
      : response.status(404).json({
          error:
            'Não foi possível encontrar este registros da tabela "parada". It was not possible to find this record in the "parada" table',
        });
  }

  async indexLinhasPorParada(request: Request, response: Response) {
    const { id } = request.params;

    const linhas = await database("linha").whereExists(function () {
      this.select("linha_parada.*")
        .from("linha_parada") // Selecionando os items da tabela de relacionamento entre parada e linha
        .whereRaw("`linha_parada`.`linha_id` = `linha`.`id`") // onde o ID da linha bate com o da tabela de relacionamento
        .whereRaw("`linha_parada`.`parada_id` = ??", [Number(id)]); // e o ID da parada base com o passado por parâmetro
    });

    return response.json(linhas);
  }

  async create(request: Request, response: Response) {
    const { nome, latitude, longitude } = request.body; // Usando desestruturação de objetos

    // Usando transaction para inserções mais seguras no banco de dados
    const trx = await database.transaction();

    try {
      await trx("parada").insert({
        nome,
        latitude,
        longitude, // Usando Object Short Syntax
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
          'Erro inesperado ao criar uma "parada". Unexpected error while creating a new "parada"',
      });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);
      const { nome, latitude, longitude } = request.body;

      await database("parada")
        .update({ nome, latitude, longitude })
        .where({ id });

      return response.send();
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Erro inesperado ao atualizar este registro da tabela "parada". Unexpected error while updating um register at "parada" table',
      });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);

      await database("parada").del().where({ id });

      return response.send();
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Erro inesperado ao deletar este registro da tabela "parada". Unexpected error while deleting this register at "parada" table',
      });
    }
  }
}
