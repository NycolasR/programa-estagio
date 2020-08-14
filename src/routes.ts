import express from "express";

import LinhasController from "./controllers/LinhasController";
import ParadasController from "./controllers/ParadasController";
import LinhaParadaController from "./controllers/LinhaParadaController";
import VeiculosController from "./controllers/VeiculosController";
import PosicaoVeiculosController from "./controllers/PosicaoVeiculosController";

const routes = express.Router(); // Módulo de roteamento do express

const linhasController = new LinhasController();
const paradasController = new ParadasController();
const linhaParadasController = new LinhaParadaController();
const veiculosController = new VeiculosController();
const posicaoVeiculosController = new PosicaoVeiculosController();

routes
  // Rotas para linhas
  .get("/linhas", linhasController.index) // Listar todas as Linhas
  .get("/linhas/:id", linhasController.indexOneByID) // Exibirá um elemento pelo ID
  .get("/veiculos_por_linha/:id", linhasController.indexVeiculosPorLinha)
  .post("/linhas", linhasController.create) // Criar uma nova Linha
  .put("/linhas/:id", linhasController.update) // Atualizar o registro de uma linha
  .delete("/linhas/:id", linhasController.delete) // Deletar o registro de uma linha

  // Rotas para paradas
  .get("/paradas", paradasController.index)
  .get("/paradas/:id", paradasController.indexOneByID)
  .get("/linhas_por_parada/:id", paradasController.indexLinhasPorParada)
  .post("/paradas", paradasController.create)
  .put("/paradas/:id", paradasController.update)
  .delete("/paradas/:id", paradasController.delete)

  // Rotas para a tabela de relacionamento entre linhas e paradas
  .get("/linha_paradas", linhaParadasController.index)
  .get("/one_linha_paradas", linhaParadasController.indexOneByID)
  .post("/linha_paradas", linhaParadasController.create)
  .put("/linha_paradas", linhaParadasController.update)
  .delete("/linha_paradas", linhaParadasController.delete)

  // Rotas para veiculos
  .get("/veiculos", veiculosController.index)
  .get("/veiculos/:id", veiculosController.indexOneByID)
  .post("/veiculos", veiculosController.create)
  .put("/veiculos/:id", veiculosController.update)
  .delete("/veiculos/:id", veiculosController.delete)

  // Rotas para posição dos veículos
  .get("/posicao_veiculos", posicaoVeiculosController.index)
  .get("/posicao_veiculos/:id", posicaoVeiculosController.indexOneByID)
  .post("/posicao_veiculos", posicaoVeiculosController.create)
  .put("/posicao_veiculos/:id", posicaoVeiculosController.update)
  .delete("/posicao_veiculos/:id", posicaoVeiculosController.delete);

export default routes;
