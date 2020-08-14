import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("posicao_veiculo", (table) => {
    table.increments("id").primary();
    table.float("latitude").notNullable();
    table.float("longitude").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now()); // Campo que especifica data de criação de cada registro

    table.integer("veiculo_id").notNullable().unique();

    table.foreign("veiculo_id").references("id").inTable("veiculo");
  });
}

export async function down(knex: Knex) {
  knex.schema.dropTable("posicao_veiculo");
}
