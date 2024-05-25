/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.string("id", 36).primary(); // will be uuid
    table.string("email", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.timestamps(true, true); // created_at and updated_at columns
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  return knex.schema.dropTable("users");
};