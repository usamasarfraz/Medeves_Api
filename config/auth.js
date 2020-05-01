const jwt = require('jsonwebtoken');
const config = require('./constants');

module.exports = (req, res, next) => {

    var ath;
    var token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, config.SECRET, async function (err, decoded) {
            if (err) {
                ath = {
                    status: false,
                    success: false
                };
                return res.status(401).json({
                    success: false,
                    msg: 'Failed to authenticate token.'
                });

            } else {
                req.decoded = decoded;
                req.decoded.status = true;
                req.decoded.success = true;
                ath = decoded;
                if (ath.user) {
                    next();
                } else {
                    ath = {
                        status: false,
                        success: false
                    };
                    return res.status(401).send({
                        success: false,
                        msg: 'No User Found'
                    });
                }
            }
        });


    } else {
        ath = {
            status: false,
            success: false
        };
        return res.status(401).send({
            success: false,
            msg: 'No token provided.'
        });
    }
    return ath;
}