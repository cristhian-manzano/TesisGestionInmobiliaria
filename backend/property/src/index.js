require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morganMiddleware = require("./config/morganConfig");
const Logger = require("./config/logger");
const db = require("./models/index");

const routes = require("./routes");
const app = express();

app.use(morganMiddleware);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", routes);

const port = process.env.APP_PORT || 3000;

// Validate if connected
db.authenticate().catch((e) => {
  Logger.error(e.toString());
});

app.listen(port, () => {
  console.log(`SERVER IS RUNNING IN PORT ${port}`);
});
