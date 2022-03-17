const { CronJob } = require('cron');
const { job } = require('./job');

let isRunning = false;

const jobCron = new CronJob('*/10 * * * * * ', async () => {
  if (!isRunning) {
    isRunning = true;
    await job();
    isRunning = false;
  }
});

module.exports = jobCron;