const { MongoClient } = require('mongodb');
const connectionString = 'mongodb+srv://mohin:mohin123@cluster0.qqhsxp7.mongodb.net/test';
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;
module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }
      dbConnection = db.db('sample_airbnb');
      console.log('Successfully connected to MongoDB.');
      return callback();
    });
  },
  getDb: function () {
    return dbConnection;
  },
};
