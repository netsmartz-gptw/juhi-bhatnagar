const cron = require('node-cron');
const deleteChoreTransactions = require("./deleteChoreTransactions")

// set cron to run every day at 1AM and delete 30 days old chore transactions
cron.schedule('0 1 * * *', deleteChoreTransactions, {
  scheduled: true,
  timezone: "America/Chicago"
})