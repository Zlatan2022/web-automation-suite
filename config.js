import { config } from "dotenv";
config();

export const configData = {
  baseUrl: process.env.BASE_URL,
  username: process.env.LOGIN_USERNAME,
  password: process.env.LOGIN_PASSWORD,
};


