export default class Validator {
    static validate(schema) {
        return (req, res, next) => {
            try {
                req.validated = schema(req.body);
                next();
            } catch (err) {
                if (err.errors) {
                    return res.status(400).json({
                        status: "Fail",
                        type: "Schema error",
                        message: err.errors.map(e => e.message).join(", "),
                        code: 400
                    });
                }
                next(err);
            }
        };
    }
}