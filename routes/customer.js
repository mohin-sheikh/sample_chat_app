const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const { registerCustomerValidator } = require('../validator/customer.validator');
let { getJWTToken } = require("../security/jwt");

router.route('/customer/register').post(registerCustomerValidator, async function (req, res) {
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
            phone_number: phone_number,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    console.log(addCustomer);
});

router.route('/user/login').post(async (req, res) => {
    try {
        const { phone_number } = req.body;
        const dbConnect = dbo.getDb();
        const user = await dbConnect
            .collection('users')
            .findOne({ phone_number: phone_number })

        if (!user) {
            return res
                .status(404)
                .send({ error: 'User Not Found' });
        }

        const generateToken = await getJWTToken({ user }); // Generating Token.
        return res
            .status(200)
            .send({
                status: 200,
                message: "Success",
                token: generateToken
            });
    } catch (error) {
        return res
            .status(400)
            .send({ status: 400, error: error.message.toString() });
    }
});

module.exports = router;