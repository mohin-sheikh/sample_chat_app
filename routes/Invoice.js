const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const mongoose = require("mongoose");
const ObjectId = mongoose["Types"].ObjectId;


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