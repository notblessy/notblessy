exports.up = function (knex) {
    return knex.schema.createTable("customer_ownerships", function (table) {
      table.bigIncrements("id");
      
      table.bigInteger("shoe_id").unsigned();
      table
        .foreign("shoe_id")
        .references("id")
        .inTable("shoes")
        .onDelete("CASCADE");

      table.string("customer_id", 255).index();
      table
        .foreign("customer_id")
        .references("id")
        .inTable("customers")
        .onDelete("CASCADE");

      table.string("serial_number", 255).notNullable().index();
      table.datetime("bought_at");

      table.timestamps(true, true);
      table.datetime("deleted_at");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("customer_ownerships");
  };
  