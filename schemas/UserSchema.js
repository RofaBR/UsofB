export default class UserSchema {
    constructor({id, login, password, fullName, email, avatarId, rating, role}) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
        this.avatarId = avatarId;
        this.rating = rating ?? 0;
        this.role = role ?? "user";
    }

    validate_email() {
        //TODO
        return this
    }

    validate_fullName() {
        //TODO
        return this
    }

    validate_login() {
        //TODO
        return this
    }
    
    validate_password() {
        //TODO
        return this
    }

    static login(data) {
        const schema = new UserSchema(data);
        schema.validate_login();
        schema.validate_password();
        return schema;
    }

    static register(data) {
        const schema = new UserSchema(data);
        schema.validate_login();
        schema.validate_password();
        schema.validate_fullName();
        return schema;
    }
}