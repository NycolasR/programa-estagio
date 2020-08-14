import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("veiculo", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.string("modelo").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now()); // Campo que especifica data de criação de cada registro

    table.integer("linha_id").notNullable();

    table // Campo que contem uma FK para a tabela Linha
      .foreign("linha_id")
      .references("id")
      .inTable("linha");
  });
}

export async function down(knex: Knex) {
  knex.schema.dropTable("veiculo");
}
