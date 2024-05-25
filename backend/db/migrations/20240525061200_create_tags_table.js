/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTable("tags", function (table) {
        table.increments("id");
        table
          .integer("todo_id")
          .references("id")
          .inTable("todos")
          .onUpdate("CASCADE")
          .onDelete("CASCADE");
        table.string("tag", 255).notNullable();
        table.timestamps(true, true); // created_at and updated_at columns
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.dropTable("tags");  
};
