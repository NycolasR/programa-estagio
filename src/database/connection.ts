// Arquivo responsável por fazer a conexão com o banco de dados

// para escrever query's para o banco de dados usando JS
import knex from "knex";

import path from "path";

const database = knex({
  client: "sqlite3", // driver usado para fornecer uma interface entre a A.P.I. e o banco de dados
  //debug: true,
  connection: {
    // Onde no projeto ficará armazenado o banco de dados
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  useNullAsDefault: true, // Valor padrão para campos não preenchidos: null
});

export default database;
