require("dotenv").config();

const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", routes);

const port = process.env.APP_PORT || 5000;

app.listen(port, () => {
  console.log("SERVER IS RUNNING");
});
