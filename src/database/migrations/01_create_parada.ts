import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("parada", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.float("latitude").notNullable();
    table.float("longitude").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now()); // Campo que especifica data de criação de cada registro
  });
}

export async function down(knex: Knex) {
  knex.schema.dropTable("parada");
}
