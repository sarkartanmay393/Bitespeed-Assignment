"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const fs_1 = __importDefault(require("fs"));
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize({
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
            ca: fs_1.default.readFileSync(__dirname + "/../ca.pem").toString(),
        },
    },
    logging: false,
});
