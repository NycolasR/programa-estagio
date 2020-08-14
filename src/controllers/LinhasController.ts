import { Request, Response } from "express";

import database from "../database/connection";

export default class LinhasController {
  async index(request: Request, response: Response) {
    try {
      const { page = 1 } = request.query; // Implementando paginação

      // Usando promisses com funções assíncronas (async await)
      const linhas = await database("linha")
        .limit(10) // Limite de elementos por página
        .offset((Number(page) - 1) * 10); // Para fazer o deslocamento do pedido de registros

      return response.json(linhas);
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Não foi possível listar os registros da tabela "linha". It was not possible to list the records in the "linha" table',
      });
    }
  }

  async indexOneByID(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const linha = await database("linha").where("linha.id", "=", id);

      return response.json(linha);
    } catch (err) {
      console.error(err);

      response.status(404).json({
        error:
          'Não foi possível encontrar este registro da tabela "linha". It was not possible to find this record in the "linha" table',
      });
    }
  }

  async indexVeiculosPorLinha(request: Request, response: Response) {
    const { id } = request.params;

    const veiculos = await database("veiculo").whereExists(function () {
      this.select("linha.*")
        .from("linha") // Selecionando todos os itens da tabela 'linha'
        .whereRaw("`linha`.`id` = `veiculo`.`linha_id`") // cujo ID está presente na tabela 'veiculo'
        .whereRaw("`linha`.`id` = ??", Number(id)); // e o ID na tabela veículo bate com o passado nos parâmetros da requisição
    });

    return response.json(veiculos);
  }

  async create(request: Request, response: Response) {
    const { nome } = request.body; // Usando desestruturação de objetos

    // Usando transaction para inserções mais seguras no banco de dados
    const trx = await database.transaction();

    try {
      await trx("linha").insert({
        nome, // Usando Object Short Syntax
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
          'Erro inesperado ao criar uma "linha". Unexpected error while creating a new "linha"',
      });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);
      const { nome } = request.body;

      await database("linha").update({ nome }).where({ id });

      return response.send();
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Erro inesperado ao atualizar este registro da tabela "linha". Unexpected error while updating um register at "linha" table',
      });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);

      await database("linha").del().where({ id });

      return response.send();
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error:
          'Erro inesperado ao deletar este registro da tabela "linha". Unexpected error while deleting this register at "linha" table',
      });
    }
  }
}
