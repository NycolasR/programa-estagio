import { Request, Response } from "express";

import database from "../database/connection";

export default class LinhaParadaController {
  async index(request: Request, response: Response) {
    try {
      const { page = 1 } = request.query; // Implementando paginação

      // Usando promisses com funções assíncronas (async await)
      const paradas = await database("linha_parada")
        .limit(10) // Limite de elementos por página
        .offset((Number(page) - 1) * 10); // Para fazer o deslocamento do pedido de registros

      return response.json(paradas);
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Não foi possível listar os registros da tabela "linha_parada". It was not possible to list the records in the "linha_parada" table',
      });
    }
  }

  async indexOneByID(request: Request, response: Response) {
    try {
      const { linha_id, parada_id } = request.query;

      const linha_parada = await database("linha_parada")
        .where("linha_parada.linha_id", "=", [Number(linha_id)])
        .where("linha_parada.parada_id", "=", [Number(parada_id)]);

      return response.json(linha_parada);
    } catch (err) {
      console.error(err);

      response.status(404).json({
        error:
          'Não foi possível encontrar este registro da tabela "linha_parada". It was not possible to find this record in the "linha_parada" table',
      });
    }
  }

  async create(request: Request, response: Response) {
    const { linha_id, parada_id } = request.body; // Usando desestruturação de objetos

    // Usando transaction para inserções mais seguras no banco de dados
    const trx = await database.transaction();

    try {
      await trx("linha_parada").insert({
        linha_id,
        parada_id, // Usando Object Short Syntax
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
          'Erro inesperado ao criar uma "linha_parada". Unexpected error while creating a new "linha_parada"',
      });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { lin_id, para_id } = request.query;
      const { linha_id, parada_id } = request.body;

      await database("linha_parada")
        .update({ linha_id, parada_id })
        .where({ linha_id: lin_id, parada_id: para_id });

      return response.send();
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Erro inesperado ao atualizar este registro da tabela "linha_parada". Unexpected error while updating um register at "linha_parada" table',
      });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { linha_id, parada_id } = request.query;

      await database("linha_parada").del().where({ linha_id, parada_id });

      return response.send();
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Erro inesperado ao deletar este registro da tabela "linha_parada". Unexpected error while deleting this register at "linha_parada" table',
      });
    }
  }
}
