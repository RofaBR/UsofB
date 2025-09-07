import bcrypt from "bcrypt"

import BaseModel from "./BaseModel";

export default class UserModel extends BaseModel {
    constructor(schema) {
        super(schema)
    }

    async hash_password(rounds) {
        this.schema.password = await bcrypt.hash(this.schema.password, rounds);
    }

    async compare_password(password) {
        return await bcrypt.compare(password, this.schema.password)
    }
}