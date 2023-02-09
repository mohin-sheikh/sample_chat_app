const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const MongoClient = require('mongodb').MongoClient;
const app = require('../app');

chai.use(chaiHttp);

describe('User registration', () => {
    let client;
    let db;

    before(async () => {
        client = await MongoClient.connect(process.env.ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = client.db('sample_chat_app');
    });

    after(async () => {
        await client.close();
    });

    it('should create a new user', (done) => {
        chai.request(app)
            .post('/user/register')
            .send({ first_name: 'test-user', last_name: 'test', phone_number: '+918390578240' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('User created successfully');

                db.collection('users').findOne({ first_name: 'test-user' }, (error, user) => {
                    expect(error).to.be.null;
                    expect(user).to.not.be.null;
                    expect(user.phone_number).to.equal('+918390578240');
                    done();
                });
            });
    });
});
