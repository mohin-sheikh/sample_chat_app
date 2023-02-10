const validate = require('./schema/customer.schema');

exports.registerCustomerValidator = (req, res, next) => {
    try {
        const { value, error } = validate.registerCustomerValidator.validate(req.body);
        if (error) {
            return res.send({ error: error.message.toString() });
        }
        req.body = value;
        next();
    } catch (e) {
        return res.send({ error: e.message.toString() });
    }
};