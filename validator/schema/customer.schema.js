const Joi = require('joi');

exports.registerCustomerValidator = Joi.object({
    name: Joi.string().lowercase().alphanum().min(3).max(30).required(),
    country_code: Joi.string().lowercase().min(2).max(4).required(),
    phone_number: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Invalid phone number. Phone number must be 10 digits.` }).required(),
});