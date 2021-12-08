import { BaseModel } from "../databases";

class CustomerOwnership extends BaseModel {
  static tableName = "customer_ownerships";

  static relationMappings = () => ({
    customer: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require("./customer").default,
      join: {
        from: "customer_ownerships.customer_id",
        to: "customers.id",
      },
    },
    shoe: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: require("./shoe").default,
        join: {
          from: "customer_ownerships.shoe_id",
          to: "shoes.id",
        },
      },
  });
}

export default CustomerOwnership;
