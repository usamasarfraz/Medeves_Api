const md5 = require('md5');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
const randtoken = require('rand-token');

const { UserModel } = require('../db/models/models');

const constants = require('../config/constants');
const User = UserModel();
let refreshTokens = {}

/*****Check User Register Or Not*****/
exports.check = async (req, res) => {
	let email = req.body.email;

	//check for if email is already registered
	User.findOne({email: email},(err,result) => {
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
exports.login = async (req, res) => {
	let email = req.body.email;
	let pwd = req.body.password;
    let enc_pwd = pwd ? md5(pwd) : null;
    let device_token = req.body.device_token;

	//check for if email is already registered
	User.findOne({email: email}, async (err,result) => {
        if (err) {
            res.send({
                status: false,
                msg: "Server Query Error.",
            })
            return
        }
        if (result) {
            if (result.password == enc_pwd) {
                await User.findOneAndUpdate({ _id:result.id },{ $set:{ device_token: device_token?device_token:"" } });
                let user = result;
                jwt.sign(
                    { user },
                    constants.SECRET,
                    {
                        expiresIn: constants.EXPIRES_IN
                    }, async (err, token) => {
                        if (err) {
                            res.send({
                                status: false,
                                err: err
                            });
                            return;
                        } else {
                            user.expiresIn = constants.EXPIRES_IN;
                            user.token = token;
                            let refreshToken = randtoken.uid(256)
						    refreshTokens[refreshToken] = user.id
                            let data = {
                                token: token,
                                expiresIn: constants.EXPIRES_IN,
                                refreshToken: refreshToken,
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
exports.register = async (req, res) => {
	let pwd = req.body.password;
    let enc_pwd = pwd ? md5(pwd) : null;
    let user_type = req.body.userType;
    req.body.password = enc_pwd;
    if(user_type == 1 || !user_type || user_type > 4){
        res.send({
            status: false,
            msg: "You are trying to hack us. Which is impossible."
        });
        return
    }else{
        let RegisterData = new User(req.body)
        RegisterData.save((err,result) => {
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
                    { user },
                    constants.SECRET,
                    {
                        expiresIn: constants.EXPIRES_IN
                    }, async (err, token) => {
                        if (err) {
                            res.send({
                                status: false,
                                err: err.message
                            });
                            return;
                        } else {
                            user.expiresIn = constants.EXPIRES_IN;
                            user.token = token;
                            let refreshToken = randtoken.uid(256)
						    refreshTokens[refreshToken] = user.id
                            let data = {
                                token: token,
                                expiresIn: constants.EXPIRES_IN,
                                refreshToken: refreshToken,
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
}

/*****Reset Password*****/
exports.resetPwd = async (req, res) => {
	var email = req.body.email_address;
	if (email) {
        let userPwd = generator.generate({
            length: 10,
            numbers: true
        });
        let enc_pwd = md5(userPwd);
		User.findOneAndUpdate({ email: email },{ $set:{ password: enc_pwd } },{new: true},(err,result)=>{
            if(err){
                res.send({
                    status: false,
                    msg: "Server Query Error.",
                })
                return
            }
            if (result) {
                var html = `Your Login password changed successfully. Your new password is ${userPwd} `;
    
                sendEmail("User password changed successfully", html, result.email)
    
                data = {
                    status: true,
                    msg: "Password changed successfully.Please check your email.",
                };
                return res.send(data);
    
            } else {
                data = {
                    status: false,
                    msg: "Invalid User", // Invalid User.
                }
                return res.send(data);
            }
        });
	} else {
		data = {
			status: false,
			msg: "Invalid User", // Invalid User.
		}
		return res.send(data);
	}
}

/*****Refresh Token*****/
exports.refreshToken = async (req, res) => {
	let user_id = req.body.user._id
	let refreshToken = req.body.refreshToken
	if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == user_id)) {
        User.findById(user_id,(err,result) => {
            if(err){
                res.send({
                    status: false,
                    msg: "Server Query Error.",
                })
                return
            }
            if(result){
                let user = result;
                jwt.sign({ user }, constants.SECRET, { expiresIn: constants.EXPIRES_IN },async (err,token)=>{
                    if (err) {
                        res.send({
                            status: false,
                            err: err
                        });
                        return;
                    } else {
                        user.expiresIn = constants.EXPIRES_IN;
                        user.token = token;
                        data = {
                            token: token,
                            expiresIn: constants.EXPIRES_IN,
                            refreshToken: refreshToken,
                            status: true,
                            msg: 'User loged in Successfully',								
                            user,
                        }

                        res.send(data);
                        return;
                    }
                })
            }else{
                return res.status(401).send({
                    success: false,
                    msg: 'Invalid User'
                });
            }
        })
	}
	else {
		return res.status(401).send({
			success: false,
			msg: 'Invalid User'
		});
	}
}

/*****User Logout*****/
exports.logout = async (req, res) => {
	let user_id = req.body.user_id
	let refreshToken = req.body.refreshToken
	if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == user_id)) {
        delete refreshTokens[refreshToken];
        return res.send({
			success: true,
			msg: 'User logged out'
		});
	}
	else {
		return res.status(401).send({
			success: false,
			msg: 'Invalid User'
		});
	}
}