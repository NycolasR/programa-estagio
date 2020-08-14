import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("linha_parada", (table) => {
    table.integer("linha_id").notNullable();
    table.foreign("linha_id").references("id").inTable("linha");

    table.integer("parada_id").notNullable();
    table.foreign("parada_id").references("id").inTable("parada");

    table.primary(["linha_id", "parada_id"]);

    table.timestamp("created_at").defaultTo(knex.fn.now()); // Campo que especifica data de criação de cada registro
  });
}

export async function down(knex: Knex) {
  knex.schema.dropTable("linha_parada");
}
