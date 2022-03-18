const { CronJob } = require("cron");
const { job } = require("./jobs/dbNotifications");

let isRunning = false;

const jobCron = new CronJob("*/30 * * * * * ", async () => {
  if (!isRunning) {
    isRunning = true;
    await job();
    isRunning = false;
  }
});

module.exports = jobCron;
