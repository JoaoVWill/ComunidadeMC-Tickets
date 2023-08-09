const client = require('./src/structures/Client')
const Config = require("./config");
const Logs = require("./src/utils/Logger");
const { connect } = require("mongoose");

try {
  connect(Config.Database, {});
  console.log(Logs.Database.Success);
} catch (err) {
  console.error(Logs.Database.Error + err);
}

process.on("uncaughtException", (err) => console.error(err));
process.on("unhandledRejection", (err) => console.error(err));

client.login(Config.Token);