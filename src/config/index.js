require("dotenv").config();

const env = process.env.NODE_ENV || "development";

//common environmental variables in all environments
const common = {
  PORT: process.env.PORT || 3000,
  SERVER_TYPE: process.env.SERVER_TYPE || "http",
  MAILGUN: {
    APIKEY: process.env.MAILGUN_API_KEY,
    DOMAIN: process.env.MAILGUN_DOMAIN,
    EMAIL: process.env.MAILGUN_CUSTOM_EMAIL,
  },
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  SIGNING_ADDRESS: process.env.SIGNING_ADDRESS,
  CONTRACT_PRIVATE_KEY: process.env.CONTRACT_PRIVATE_KEY,
  PROVIDER_URL: process.env.PROVIDER_URL,
  STOP_PHYSICAL_MINTING: process.env.STOP_PHYSICAL_MINTING,
};

const development = {
  env: "development",
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/buildspace-africa",
  ...common,
};

const production = {
  env: "production",
  DB_URI: process.env.DB_URI,
  ...common,
};

const config = {
  development,
  production,
};

module.exports = config[env];
