import fs from "fs";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "bitespeed",
  host: "pg-1d02b618-sarkartanmay393-034b.a.aivencloud.com",
  port: 14056,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: fs.readFileSync(__dirname + "/../ca.pem").toString(),
    },
  },
  logging: false,
});
