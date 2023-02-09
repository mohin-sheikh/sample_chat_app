const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const { messageValidator } = require('../validator/message.validator');
const { verifyToken } = require('../middleware/middleware');
const mongoose = require("mongoose");
const ObjectId = mongoose["Types"].ObjectId;

router.route('/message/send').post(verifyToken, messageValidator, async function (req, res) {
    const dbConnect = dbo.getDb();
    const { receiver_id, message } = req.body;

    dbConnect
        .collection('messages')
        .insertOne({
            sender_id: ObjectId(req.user._id),
            receiver_id: ObjectId(receiver_id),
            message,
            createdAt: new Date(),
            updatedAt: new Date()
        }, function (err, result) {
            if (err) {
                res.status(400).send('Error inserting matches!');
            } else {
                res.status(201).send({
                    message: "Message sent successfully.",
                    user_id: result.insertedId
                }
                );
            }
        });
});

module.exports = router;