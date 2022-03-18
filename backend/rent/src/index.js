require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morganMiddleware = require('./config/morgan');
const Logger = require('./config/logger');
const db = require('./models/index');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors({}));
app.use(express.json());
app.use(morganMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

db.authenticate().catch((e) => {
  Logger.error(e.message);
});

app.listen(PORT, () => {
  Logger.info(`SERVER IS RUNNING IN PORT ${PORT}`);
});
