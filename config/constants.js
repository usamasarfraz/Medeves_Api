const APP_TITLE = 'Medeves';
const URL = 'http://localhost:3880';

// Email
let SMTP_SERVICE = "gmail";
let SMTP_TYPE = "OAuth2";
let SMTP_FROM_EMAIL = "medeves.team@gmail.com";
let SMTP_CLIENT_ID = "62283766908-g3tucojrfi839jfcj24m925lr8lvcgk6.apps.googleusercontent.com";
let SMTP_CLIENT_SECRET = "dHy12fwHNf5PGwDK0vftaXuP";
let SMTP_REDIRECT_URL = "https://developers.google.com/oauthplayground";
let SMTP_REFRESH_TOKEN = "1//044l5A6Y-gsEcCgYIARAAGAQSNwF-L9Ir7rmRHwIsJCHGZKihkmQXi6AMOP-GGfkklnMLJ6V6gbRk1baWr1kwjoLyQpvFOXHbJ_Y";

module.exports = {
	APP_TITLE: APP_TITLE,
	HOST: URL,
	PORT: "",
	SECRET: 'keepitsecretwithauthformedeves!@#',
	EXPIRES_IN: '86400s',
	SMTP_FROM_EMAIL,
	SMTP_CLIENT_ID,
	SMTP_CLIENT_SECRET,
	SMTP_REDIRECT_URL,
	SMTP_REFRESH_TOKEN,
	SMTP_SERVICE,
	SMTP_TYPE
};