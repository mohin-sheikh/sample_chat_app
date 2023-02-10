const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const { registerCustomerValidator } = require('../validator/customer.validator');
let { getJWTToken } = require("../security/jwt");

router.route('/customer/register').post(registerCustomerValidator, async function (req, res) {
    try {
        const dbConnect = dbo.getDb();
        const { name, phone_number } = req.body;

        const customer = await dbConnect
            .collection('customers')
            .findOne({ phone_number: phone_number })

        if (customer) {
            return res.status(400).json({ error: 'customer is already exist' });
        }

        const addCustomer = await dbConnect
            .collection('customers')
            .insertOne({
                name,
                phone_number,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        return res.status(201).send({
            message: "Customer registered successfully.",
            _id: addCustomer.insertedId
        })
    } catch (error) {
        return res
            .status(400)
            .send({ status: 400, error: error.message.toString() });
    }

});

module.exports = router;