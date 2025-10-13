export default class Validator {
    static validate(schema) {
        return (req, res, next) => {
            try {
                req.validated = schema(req.body);
                next();
            } catch (err) {
                if (err.issues) {
                    const firstError = err.issues[0];
                    const errorMessage = firstError.message;

                    return res.status(400).json({
                        status: "error",
                        message: errorMessage,
                        code: 400
                    });
                }
                if (err.errors) {
                    return res.status(400).json({
                        status: "error",
                        message: err.errors.map(e => e.message).join(", "),
                        code: 400
                    });
                }
                next(err);
            }
        };
    }
}