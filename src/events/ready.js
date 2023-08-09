const Logs = require('../utils/Logger')
const Config = require('../../config')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
      try {
        client.user.setActivity(Config.Status);
        client.user.setStatus("idle")
        console.log(Logs.Bot.Success);
      } catch(err) {
        console.error(Logs.Bot.Error + err)
      }
    },
  };
  