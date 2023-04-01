import * as dotenv from 'dotenv';
dotenv.config();
module.exports = {
  AUTH_MONGO: process.env.AUTH_MONGO,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URL: process.env.MONGODB_URL,
  MONGODB_AUTHSOURCE: process.env.MONGODB_AUTHSOURCE,
	URL_FORWARDING: process.env.URL_FORWARDING
};
