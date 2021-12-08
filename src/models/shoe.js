import { BaseModel } from '../databases';
class Shoe extends BaseModel {
  static tableName = 'shoes';

  static relationMappings = () => ({
    shoe_category: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: require("./shoe_category").default,
      join: {
        from: "shoes.category_id",
        to: "shoe_categories.id",
      },
    },
    customer_ownerships: {
      relation: BaseModel.HasManyRelation,
      modelClass: require("./customer_ownership").default,
      join: {
        from: "shoes.id",
        to: "customer_ownerships.shoe_id",
      },
    },
  });
}

export default Shoe;
