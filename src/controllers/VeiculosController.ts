import { Request, Response } from "express";

import database from "../database/connection";

export default class VeiculosController {
  async index(request: Request, response: Response) {
    try {
      const { page = 1 } = request.query; // Implementando paginação

      // Usando promisses com funções assíncronas (async await)
      const veiculos = await database("veiculo")
        .limit(10) // Limite de elementos por página
        .offset((Number(page) - 1) * 10); // Para fazer o deslocamento do pedido de registros

      return response.json(veiculos);
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Não foi possível listar os registros da tabela "veiculo". It was not possible to list the records in the "veiculo" table',
      });
    }
  }

  async indexOneByID(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const veiculo = await database("veiculo").where("veiculo.id", "=", id);

      return response.json(veiculo);
    } catch (err) {
      console.error(err);

      response.status(404).json({
        error:
          'Não foi possível encontrar este registro da tabela "veiculo". It was not possible to find this record in the "veiculo" table',
      });
    }
  }

  async create(request: Request, response: Response) {
    const { nome, modelo, linha_id } = request.body; // Usando desestruturação de objetos

    // Usando transaction para inserções mais seguras no banco de dados
    const trx = await database.transaction();

    try {
      await trx("veiculo").insert({
        nome,
        modelo,
        linha_id, // Usando Object Short Syntax
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
          'Erro inesperado ao criar um "veiculo". Unexpected error while creating a new "veiculo"',
      });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);
      const { nome, modelo, linha_id } = request.body;

      await database("veiculo")
        .update({ nome, modelo, linha_id })
        .where({ id });

      return response.send();
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Erro inesperado ao atualizar este registro da tabela "veiculo". Unexpected error while updating um register at "veiculo" table',
      });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);

      await database("veiculo").del().where({ id });

      return response.send();
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Erro inesperado ao deletar este registro da tabela "veiculo". Unexpected error while deleting this register at "veiculo" table',
      });
    }
  }
}
