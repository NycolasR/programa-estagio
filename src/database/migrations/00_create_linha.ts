import Knex from "knex";

// Para as alterações que devem ser feitas no banco de dados
export async function up(knex: Knex) {
  return knex.schema.createTable("linha", (table) => {
    table.increments("id").primary(); // Campo 'id' com autoincremento
    table.string("nome").notNullable(); // Campo 'nome' que exige um valor diferente de null

    table.timestamp("created_at").defaultTo(knex.fn.now()); // Campo que especifica data de criação de cada registro
  });
}

// Para desfazer as alterações feitas pela função up()
export async function down(knex: Knex) {
  return knex.schema.dropTable("linha");
}
