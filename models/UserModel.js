import BaseModel from "./BaseModel";
import UserSchema from "../schemas/UserSchema"
export default class UserModel extends BaseModel {
    constructor(UserSchema) {
        super(UserSchema)
    }

}