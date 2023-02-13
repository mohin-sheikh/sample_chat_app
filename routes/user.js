const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const { registerUserValidator } = require('../validator/user.validator');
let { getJWTToken } = require("../security/jwt");


router.route('/').get(async function (req, res) {
  return res
    .status(200)
    .send({ message: 'Welcome to Chat Application' });
});

router.route('/user/register').post(registerUserValidator, async function (req, res) {
  const dbConnect = dbo.getDb();
  const { phone_number, first_name, last_name } = req.body;

  const user = await dbConnect
    .collection('users')
    .findOne({ phone_number: phone_number })

  if (user) {
    return res.status(400).json({ message: 'user is already exist' });
  }

  dbConnect
    .collection('users')
    .insertOne({
      first_name,
      last_name,
      phone_number: phone_number,
      createdAt: new Date(),
      updatedAt: new Date()
    }, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting matches!');
      } else {
        res.status(201).send({
          message: "User registered successfully.",
          user_id: result.insertedId
        }
        );
      }
    });
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