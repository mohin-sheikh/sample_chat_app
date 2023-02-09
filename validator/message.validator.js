const validate = require('./schema/message.schema');

exports.messageValidator = (req, res, next) => {
    try {
        const { value, error } = validate.messageValidator.validate(req.body);
        if (error) {
            return res.send({ error: error.message.toString() });
        }
        req.body = value;
        next();
    } catch (e) {
        return res.send({ error: e.message.toString() });
    }
};