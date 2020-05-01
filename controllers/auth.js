const md5 = require('md5');
const jwt = require('jsonwebtoken');
const { User } = require('../db/models/models');

const constants = require('../config/constants');

/*****Check User Register Or Not*****/
exports.check = async function (req, res) {
	let email = req.body.email_address;

	//check for if email is already registered
	User().findOne({email: email}, function(err,result) {
        if (err) {
            res.send({
                status: false,
                error: true,
                msg: "Server Query Error.",
            })
            return
        }
        if (result) {
            res.send({
                status: true,
                error: false,
                msg: "User Already Registered.",
            })
            return
        } else {
            res.send({
                status: false,
                error: false,
                msg: "User Not Registered.",
            })
            return
        }
    });
}


/*****User Login*****/
exports.login = async function (req, res) {
	let email = req.body.email_address;
	let pwd = req.body.password;
    let enc_pwd = pwd ? md5(pwd) : null;
    let device_token = req.body.device_token;

	//check for if email is already registered
	User().findOne({email: email}, function(err,result) {
        if (err) {
            res.send({
                status: false,
                msg: "Server Query Error.",
            })
            return
        }
        if (result) {
            if (result.password == enc_pwd) {
                User().findOneAndUpdate({ _id: result._id },{ device_token: device_token });
                let user = result;
                jwt.sign(
                    {
                        user
                    },
                    constants.SECRET,
                    {
                        expiresIn: constants.EXPIRES_IN
                    }, async function (err, token) {
                        if (err) {
                            res.send({
                                status: false,
                                err: err
                            });
                            return;
                        } else {
                            user.expiresIn = constants.EXPIRES_IN;
                            user.token = token;
                            let data = {
                                token: token,
                                status: true,
                                msg: 'User loged in Successfully', 								
                                user,
                            }
                            res.send(data);
                            return;
                        }
                    }
                );
    
            } else {
                let data = {
                    status: false,
                    msg: 'Invalid email or password',
                    data: null
                }
                res.send(data);
                return;
            }
        } else {
            res.send({
                status: false,
                msg: "User Not Registered.",
            })
            return
        }
    });
}

/*****User Register*****/
exports.register = async function (req, res) {
	let pwd = req.body.password;
    let enc_pwd = pwd ? md5(pwd) : null;
    req.body.password = enc_pwd;
    let RegisterData = new User(req.body)
	RegisterData.save(function(err,result) {
        if (err) {
            res.send({
                status: false,
                msg: "Server Query Error.",
            })
            return
        }
        if (result) {
            let user = result;
            jwt.sign(
                {
                    user
                },
                constants.SECRET,
                {
                    expiresIn: constants.EXPIRES_IN
                }, async function (err, token) {
                    if (err) {
                        res.send({
                            status: false,
                            err: err
                        });
                        return;
                    } else {
                        user.expiresIn = constants.EXPIRES_IN;
                        user.token = token;
                        let data = {
                            token: token,
                            status: true,
                            msg: 'User loged in Successfully', 								
                            user,
                        }
                        res.send(data);
                        return;
                    }
                }
            );
        } else {
            res.send({
                status: false,
                msg: "User Not Registered.",
            })
            return
        }
    });
}

/*****Reset Password*****/
exports.resetPwd = async function (req, res) {
	var email = req.body.email_address;
	console.log(req.body);
	if (email) {
		var selectUserQ = `SELECT * FROM users WHERE email_address= '${email}' LIMIT 1`;
		var user = await sql.query(selectUserQ);

		if (user.length) {
			var userPwd = generator.generate({
				length: 10,
				numbers: true
			});
			var enc_pwd = md5(userPwd);

			let updateDealerAgentQ = `UPDATE users SET password='${enc_pwd}' WHERE email_address='${email}'`;
			let updateDealer = await sql.query(updateDealerAgentQ);
			if (updateDealer.affectedRows === 0) {
				data = {
					status: false,
					msg: "User password is not changed.", // Password changed successfully.Please check your email.
				};
				return res.send(data);
			} else {

				var html = `Your Login password changed successfully. Your new password is ${userPwd} `;

				sendEmail("User password changed successfully", html, user[0].email_address)

				data = {
					status: true,
					msg: "Password changed successfully", // Password changed successfully.Please check your email.
				};
				return res.send(data);
			}

		} else {
			data = {
				status: false,
				msg: "Invalid User", // Invalid User.
			}
			return res.send(data);
		}
	} else {
		data = {
			status: false,
			msg: "Invalid User", // Invalid User.
		}
		return res.send(data);
	}
}

/*****Refresh Token*****/
exports.refreshToken = async function (req, res) {
	var user_id = req.body.user_id
	var refreshToken = req.body.refreshToken
	if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == user_id)) {
		var userQ = `SELECT * FROM users WHERE id = '${user_id}' limit 1`;
		var users = await sql.query(userQ);
		if (users && users.length) {
			let user = users[0]

			var token = jwt.sign(users[0], SECRET, { expiresIn: 300 })
			user.expiresIn = constants.EXPIRES_IN;
			// console.log("logged in user", user[0]);
			user.token = token;
			data = {
				token: token,
				status: true,
				msg: 'User loged in Successfully', // 								
				user,
			}

			res.send(data);
			return;
		} else {
			return res.status(401).send({
				success: false,
				msg: 'Invalid User'
			});
		}
	}
	else {
		return res.status(401).send({
			success: false,
			msg: 'Invalid User'
		});
	}
}