const validate = require('./schema/invoice.schema');

exports.invoiceValidator = (req, res, next) => {
    try {
        const { value, error } = validate.invoiceValidator.validate(req.body);
        if (error) {
            return res.send({ error: error.message.toString() });
        }
        req.body = value;
        next();
    } catch (e) {
        return res.send({ error: e.message.toString() });
    }
};