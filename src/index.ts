import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

import { sequelize } from "./database";
import Identify from "./routes/indentify";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.post("/identify", Identify);

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
