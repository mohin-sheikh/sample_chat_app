const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const { registerCustomerValidator } = require('../validator/customer.validator');
let { getJWTToken } = require("../security/jwt");
const mongoose = require("mongoose");
const ObjectId = mongoose["Types"].ObjectId;

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


router.route('/register/invoice').post((req, res) => {
    try {
        const dbConnect = dbo.getDb();

        dbConnect.collection('invoices').insertOne({
            customer_id: ObjectId(req.body.customer_id),
            date: req.body.date,
            total: req.body.total
        }, (err, result) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Failed to create invoice'
                });
            }

            return res.status(200).send({
                success: true,
                message: 'Invoice created successfully'
            });
        });
    } catch (error) {
        return res
            .status(400)
            .send({ status: 400, error: error.message.toString() });
    }
});

router.route('/invoices').get((req, res) => {
    try {
        const dbConnect = dbo.getDb();
        dbConnect.collection('invoices')
            .aggregate([
                {
                    $lookup: {
                        from: 'customers',
                        localField: 'customer_id',
                        foreignField: '_id',
                        as: 'customer'
                    }
                },
                {
                    $unwind: '$customer'
                },
                {
                    $project: {
                        _id: '$_id',
                        customer: {
                            name: '$customer.name',
                            phone: '$customer.phone'
                        },
                        date: '$date',
                        total: '$total'
                    }
                }
            ])
            .toArray((err, invoices) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Failed to retrieve invoices'
                    });
                }
                return res.status(200).send({
                    success: true,
                    data: invoices
                });
            });
    } catch (error) {
        return res
            .status(400)
            .send({ status: 400, error: error.message.toString() });
    }
});

module.exports = router;