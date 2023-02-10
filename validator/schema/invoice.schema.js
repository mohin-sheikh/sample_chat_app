const Joi = require('joi');

exports.registerUserValidator = Joi.object({
    date: Joi.date().required(),
    total: Joi.string().lowercase().min(3).max(30).required(),
    phone_number: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Invalid phone number. Phone number must be 10 digits.` }).required(),
});