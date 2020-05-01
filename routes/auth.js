var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth')

/*****User Auth*****/
router.post('/check', authController.check);

router.post('/login', authController.login);

router.post('/register', authController.register);

router.post('/reset-password', authController.resetPwd);

router.post('/refreshToken', authController.refreshToken)

module.exports = router;