/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  return knex.schema.createTable("todos", function (table) {
    table.increments("id");
    table
      .uuid("user_id")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("title", 255).notNullable();
    table.text("comment").notNullable();
    table.string("image_link", 255);
    table.string("file_link", 255);
    table.boolean("is_done").defaultTo(false);
    table.timestamps(true, true); // created_at and updated_at columns
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  return knex.schema.dropTable("todos");
};