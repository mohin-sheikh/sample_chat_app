const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const { registerUserValidator } = require('../validator/user.validator')

router.route('/listings').get(async function (_req, res) {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection('listingsAndReviews')
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

router.route('/user/register').post(registerUserValidator, async function (req, res) {
  const dbConnect = dbo.getDb();
  const { country_code, phone_number, first_name, last_name } = req.body;

  const user = await dbConnect
    .collection('users')
    .findOne({ phone_number: country_code + phone_number })

  if (user) {
    return res.status(400).json({ message: 'user is already exist' });
  }

  dbConnect
    .collection('users')
    .insertOne({
      first_name,
      last_name,
      phone_number: country_code + phone_number,
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

router.route('/listings/updateLike').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { _id: req.body.id };
  const updates = {
    $inc: {
      likes: 1,
    },
  };

  dbConnect
    .collection('listingsAndReviews')
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
      }
    });
});

router.route('/listings/delete/:id').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { listing_id: req.body.id };

  dbConnect
    .collection('listingsAndReviews')
    .deleteOne(listingQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log('1 document deleted');
      }
    });
});

module.exports = router;