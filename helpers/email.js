const nodemailer = require('nodemailer');
const Constants = require('../config/constants');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
	Constants.SMTP_CLIENT_ID, // ClientID
	Constants.SMTP_CLIENT_SECRET, // Client Secret
	Constants.SMTP_REDIRECT_URL // Redirect URL
);
oauth2Client.setCredentials({
	refresh_token: Constants.SMTP_REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
	service: Constants.SMTP_SERVICE,
	auth: {
		type: Constants.SMTP_TYPE,
		user: Constants.SMTP_FROM_EMAIL, 
		clientId: Constants.SMTP_CLIENT_ID,
		clientSecret: Constants.SMTP_CLIENT_SECRET,
		refreshToken: Constants.SMTP_REFRESH_TOKEN,
		accessToken: accessToken
	}
});



exports.sendEmail = (subject, message, to, callback) => {
	let cb = callback;
	subject = `${Constants.APP_TITLE} ${subject}`
	let mailOptions = {
		from: Constants.SMTP_FROM_EMAIL,
		to: to,
		subject: subject,
		html: message
	};
	smtpTransport.sendMail(mailOptions, cb);
}