let { getObjectFromJWT } = require('../security/jwt');
let { setDecodedPayload, getDecodedPayload } = require('../helper/auth');


exports.verifyToken = async (req, res, next) => {
    let auth = req.get('Authorization')
    if (!auth) {
        res.status(400).send("TOKEN MISSING");
    } else {
        let token = auth.split(' ')[1];
        if (!token) {
            res
                .status(400)
                .send("TOKEN MISSING");
        } else {
            try {
                setDecodedPayload(req, getObjectFromJWT(token));
                req.user = getDecodedPayload(req);
                req.user = req.user.user;
                next();
            } catch (err) {
                console.log(err);
                if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError")
                    return res.status(200).send("SESSION EXPIRED")
                return res.status(200).send("FAILURE")
            }
        }
    }
};
