require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morganMiddleware = require('./config/morgan');
const appRoutes = require('./api/routes');
const db = require('./api/models/index');
const Logger = require('./config/logger');

const app = express();

app.use(morganMiddleware);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', appRoutes);
// Run server

const port = process.env.PORT || 5000;

db.authenticate()
  .then(() => {
    app.listen(port, () => {
      Logger.debug(`Running app in port ${port}`);
    });
  })
  .catch((e) => {
    Logger.error(e.message);
  });
