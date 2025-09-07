export default class ExcxeptionSchema extends Error{
    constructor(value, code) {
        super();

        this.value = value
        this.code = code
    }

    toString() {
        return this.constructor.errors[this.value];
    }

    form_response() {
        return {
            status: "Fail",
            type: "Schema error",
            message: this.toString(),
            code: this.code
        }
    }
}