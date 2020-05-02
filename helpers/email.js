var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var constants = require('../config/constants');

var transporter = nodemailer.createTransport(smtpTransport({
	host: 'smtp.gmail.com',
	port: 587,
	// secure: false,
	// requireTLS: true,
	// secureConnection: true,
	// logger: true,
	// debug: true,

	connectionTimeout: 600000,
	greetingTimeout: 300000,

	auth: {
		user: constants.SMTP_USERNAME,
		pass: constants.SMTP_PASSWORD
	}
}));



exports.sendEmail = (subject, message, to, callback) => {
	let cb = callback;
	subject = `${constants.SMTP_COMMON_SUBJECT} ${subject}`

	let mailOptions = {
		from: constants.SMTP_FROM_EMAIL,
		to: to,
		subject: subject,
		html: message
	};
	transporter.sendMail(mailOptions, cb);
}