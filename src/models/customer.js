import { BaseModel } from '../databases';

class Customer extends BaseModel {
  static tableName = 'customers';

  static relationMappings = () => ({
    customer_ownerships: {
      relation: BaseModel.HasManyRelation,
      modelClass: require("./customer_ownership").default,
      join: {
        from: "customers.id",
        to: "customer_ownerships.customer_id",
      },
    },
  });
}

export default Customer;
