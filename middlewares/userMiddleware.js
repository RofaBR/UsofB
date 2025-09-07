export default class Validator {
    static validate(schemaMethod) {
        return (req, res, next) => {
            try {
                const schema = schemaMethod(req.body);
                req.validated = schema;
                next();
            } catch (err) {
                if (err instanceof Error && typeof err.form_response === "function") {
                return res.status(err.code).json(err.form_response());
                }
                next(err);
            }
        };
    }
}