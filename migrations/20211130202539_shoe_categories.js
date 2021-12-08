exports.up = function (knex) {
    return knex.schema.createTable("shoe_categories", function (table) {
      table.bigIncrements("id");
      table.string("name", 255).notNullable().index();
      table.string("slug", 255).index();
      table.text("description");
      table.text("picture");
      table.timestamps(true, true);
      table.datetime("deleted_at");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("shoe_categories");
  };
  