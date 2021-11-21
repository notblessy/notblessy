import { BaseModel } from '../databases';
class User extends BaseModel {
  static tableName = 'users';
}

export default User;
