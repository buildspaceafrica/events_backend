const Agenda = require("agenda");
const { DB_URI } = require("./index");

const connectionOpts = {
  db: { address: DB_URI, collection: "jobs" },
};

const agenda = new Agenda(connectionOpts);

module.exports = agenda;
