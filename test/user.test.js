/* const chai = require('chai');
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
            .send({ first_name: 'mohin', last_name: 'sheikh', phone_number: '+918830186746' })
            .end((err, res) => {
                expect(res).to.have.status(200);

                db.collection('users').findOne({ first_name: 'mohin' }, (error, user) => {
                    expect(error).to.be.null;
                    expect(user).to.not.be.null;
                    expect(user.phone_number).to.equal('+918390578240');
                    done();
                });
            });
    });
});
 */

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

chai.use(chaiHttp);
const expect = chai.expect;

describe("User registration", () => {
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
    it("should create a new user", async () => {
        return new Promise(async (done) => {
            const users = db.collection("users");

            const res = await chai
                .request(app)
                .post("/user/register")
                .send({
                    first_name: "test",
                    last_name: "user",
                    phone_number: "9823054102"
                });
            expect(res).to.have.status(201);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal("User registered successfully.");

            const insertedUser = await users.findOne({ first_name: "test" });
            expect(insertedUser).to.be.an("object");
            expect(insertedUser).to.have.property("first_name");
            expect(insertedUser).to.have.property("last_name");
            expect(insertedUser.first_name).to.equal("test");
            expect(insertedUser.last_name).to.equal("user");
            expect(insertedUser).to.have.property("phone_number");
            expect(insertedUser.phone_number).to.equal("9823054102");
            done();
        });
    });
});
