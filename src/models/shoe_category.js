import { BaseModel } from '../databases';
class ShoeCategory extends BaseModel {
  static tableName = 'shoe_categories';

  static relationMappings = () => ({
    shoes: {
      relation: BaseModel.HasManyRelation,
      modelClass: require("./shoe").default,
      join: {
        from: "shoe_categories.id",
        to: "shoes.category_id",
      },
    },
  });
}

export default ShoeCategory;
