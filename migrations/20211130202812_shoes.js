exports.up = function (knex) {
    return knex.schema.createTable("shoes", function (table) {
      table.bigIncrements("id");
      table.string("name", 255).notNullable().index();

      table.bigInteger("category_id").unsigned();
        table
        .foreign("category_id")
        .references("id")
        .inTable("shoe_categories")
        .onDelete("CASCADE");

      table.string("slug", 255).index();
      table.text("description");
      table.text("picture");
      table.text("serie");
      table.timestamps(true, true);
      table.datetime("deleted_at");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("shoes");
  };
  