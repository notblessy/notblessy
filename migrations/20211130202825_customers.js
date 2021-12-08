exports.up = function (knex) {
    return knex.schema.createTable("customers", function (table) {
      table.string("id", 255).notNullable().primary().index();
      table.string("name", 255).notNullable().index();
      table.string("email", 255).index();
      table.timestamps(true, true);
      table.datetime("deleted_at");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("customers");
  };
  