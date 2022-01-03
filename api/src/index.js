require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morganMiddleware = require('./config/morgan');
const appRoutes = require('./api/routes');

const app = express();

app.use(morganMiddleware);
app.use(helmet());
app.use(cors());

app.use('/', appRoutes);
// Run server

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Running app in port ${port}`);
});
