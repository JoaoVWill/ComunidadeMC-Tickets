const Logs = require('../utils/Logger')
const Config = require('../../config')

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        if (newMessage.author.bot || !newMessage.guild) return;
		if (oldMessage.content === newMessage.content) return;

		client.emit('messageCreate', newMessage);
    },
  };
  