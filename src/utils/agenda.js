const agenda = require("../config/agenda.config");

require("../jobs/mintTicket")(agenda);

agenda.on("ready", async () => {
  await agenda.start();
  await agenda.cancel({ nextRunAt: null, failedAt: { $exists: false } });
});

let graceful = () => {
  agenda.stop(() => process.exit(0));
};

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

module.exports = agenda;
