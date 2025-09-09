import ExcxeptionSchema from "./ExceptionSchema.js";

export default class UserExceptionSchema extends ExcxeptionSchema {
    static errors = Object.freeze([
        "Invalid login",
        "Invalid password",
        "Invalid username"
    ]);

    static get INVALID_LOGIN() {
        return new this(0, 400);
    }

    static get INVALID_PASSWORD() {
        return new this(1, 400);
    }

    static get INVALID_USERNAME() {
        return new this(2, 400);
    }
}