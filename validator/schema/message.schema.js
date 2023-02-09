const Joi = require('joi');

exports.messageValidator = Joi.object({
    receiver_id: Joi.string().required(),
    message: Joi.string().required(),
});