const md5 = require('md5');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
const randtoken = require('rand-token');
const { sendEmail } = require('../helpers/email');
const { User, Store, Rider } = require('../db/models/index');
const { upload } = require('../helpers/multer');
const constants = require('../config/constants');
let refreshTokens = {};

/*****Check User Register Or Not*****/
exports.check = async (req, res) => {
	let email = req.body.email;
    let foundData = (result) => {
        res.send({
            status: true,
            error: false,
            user_type: result.userType,
            msg: "User Already Registered.",
        })
        return
    }
    let dataNotFound = () => {
        res.send({
            status: false,
            error: false,
            msg: "User Not Registered.",
        })
        return
    }
    //check for if email is already registered
    let Model = User;
    var user = await Model.findOne({email: email});
    if(user){
        foundData(user);
    }else{
        var store = await Store.findOne({email: email});
        if(store){
            foundData(store);
        }else{
            var rider = await Rider.findOne({email: email});
            if(rider){
                foundData(rider);
            }else{
                dataNotFound();
            }
        }
    }
}


/*****User Login*****/
exports.login = async (req, res) => {
	let email = req.body.email;
    let pwd = req.body.password;
    let user_type = req.body.userType;
    let enc_pwd = pwd ? md5(pwd) : null;
    let device_token = req.body.device_token;

    //check for if email is already registered
        let Model = User;
        switch (user_type) {
            case 2:
                Model = User;
            break;
            case 3:
                Model = Store;
            break;
            case 4:
                Model = Rider;
            break;
        }
        Model.findOne({email: email}, async (err,result) => {
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
                user.device_token = device_token;
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
    upload(req, res, (err) => {
        let pwd = req.body.password;
        let enc_pwd = pwd ? md5(pwd) : null;
        let user_type = Number(req.body.userType);
        req.body.password = enc_pwd;
        if(err){
          res.send({
            status: false,
            msg: err.message
          });
        } else {
            if(user_type == 1 || !user_type || user_type > 4){
                res.send({
                    status: false,
                    msg: "You are trying to hack us. Which is impossible."
                });
                return
            }else{
                let Model = User;
                switch (user_type) {
                    case 2:
                        Model = User;
                    break;
                    case 3:
                        Model = Store;
                    break;
                    case 4:
                        Model = Rider;
                    break;
                }
                req.body.images = req.files;
                let RegisterData = new Model(req.body);
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
    })
}

/*****Reset Password*****/
exports.resetPwd = async (req, res) => {
	let email = req.body.email;
	let user_type = req.body.userType;
	if (email) {
        let userPwd = generator.generate({
            length: 10,
            numbers: true
        });
        let enc_pwd = md5(userPwd);
        let Model = User;
        switch (user_type) {
            case 2:
                Model = User;
            break;
            case 3:
                Model = Store;
            break;
            case 4:
                Model = Rider;
            break;
        }
		Model.findOneAndUpdate({ email: email },{ $set:{ password: enc_pwd } },{new: true},(err,result)=>{
            if(err){
                res.send({
                    status: false,
                    msg: "Server Query Error.",
                })
                return
            }
            if (result) {
                let html = `Your Login password changed successfully. Your new password is ${userPwd}.`;
    
                sendEmail("User password changed successfully", html, result.email,(err)=>{
                    if (err) {
                        data = {
                            status: false,
                            msg: "Password not changed.Please try again.",
                        };
                        return res.send(data);
                    }else{
                        data = {
                            status: true,
                            msg: "Password changed successfully.Please check your email or see in spam.",
                        };
                        return res.send(data);
                    }
                });
    
            } else {
                data = {
                    status: false,
                    msg: "Invalid User",
                }
                return res.send(data);
            }
        });
	} else {
		data = {
			status: false,
			msg: "Invalid User",
		}
		return res.send(data);
	}
}

/*****Refresh Token*****/
exports.refreshToken = async (req, res) => {
    let user_id = req.body.user._id
    let user_type = req.body.user.userType
	let refreshToken = req.body.refreshToken
	if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == user_id)) {
        let Model = User;
        switch (user_type) {
            case 2:
                Model = User;
            break;
            case 3:
                Model = Store;
            break;
            case 4:
                Model = Rider;
            break;
        }
        Model.findById(user_id,(err,result) => {
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
                return res.send({
                    status: false,
                    msg: 'Invalid User'
                });
            }
        })
	}
	else {
		return res.send({
			status: false,
			msg: 'Invalid User'
		});
	}
}

/*****User Logout*****/
exports.logout = async (req, res) => {
	let user_id = req.body.user._id
    let user_type = req.body.user.userType
	let refreshToken = req.body.refreshToken
	if (user_id) {
        let Model = User;
        switch (user_type) {
            case 2:
                Model = User;
            break;
            case 3:
                Model = Store;
            break;
            case 4:
                Model = Rider;
            break;
        }
        Model.findOneAndUpdate({ _id: user_id },{ $set:{ device_token: "" } },{new: true},(err,result)=>{
            if(err){
                res.send({
                    status: false,
                    msg: "Server Query Error.",
                })
                return
            }
            if (result) {
                delete refreshTokens[refreshToken];
                return res.send({
                    status: true,
                    msg: 'User logged out'
                });
            } else {
                data = {
                    status: false,
                    msg: "Invalid User",
                }
                return res.send(data);
            }
        });
	}
	else {
		return res.status(401).send({
			status: false,
			msg: 'Invalid User'
		});
	}
}