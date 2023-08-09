const { ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { inspect } = require('util');

module.exports = {
  name: 'eval',
  description: 'Utilize o console do bot.',
  aliases: ["console", "terminal", "ev"],
  async execute({message, client, config, args, emoji}) {
    if (!client.developers.includes(message.author.id)) return;
    
    if(!args[0]) return;

		let x = new ButtonBuilder();
		x.setCustomId('x');
		x.setStyle(2);
		x.setEmoji(emoji.Trash);

		const filter = i => ['x'].includes(i.customId);

		const collector = message.channel.createMessageComponentCollector({ filter, time: 120000, idle: 120000 });

		let row = new ActionRowBuilder().setComponents(x);

		const clean = (text) => {
			if (text === 'string') {
				text = text.slice(0, 1970)
					.replace(/`/g, `\`${String.fromCharCode(8203)}`)
					.replace(/@/g, `@${String.fromCharCode(8203)}`);
			}
			return text;
		};

		try {
			const code = args.join(' ');
			let evaled = eval(code);

			if (evaled instanceof Promise) {evaled = await evaled;}

			const msg = await message.reply({ content: `**Saída**: \`\`\`js\n${clean(inspect(evaled, { depth: 0 }).replace(new RegExp(client.token, 'gi'), '******************').slice(0, 1970))}\n\`\`\``, components: [row] });
			collector.on('collect', async (button) => {

				if (button.user.id != message.author.id) {
					return await button.reply({ content: `${emoji.Error} › **Desculpe**, você precisa **utilizar** o comando para **isto**.`, ephemeral: true });
				}

				switch(button.customId) {
					case 'x':
						await msg.edit({ content: `${emoji.Success} › **Resultado** do eval **fechado** com sucesso.`, components: [] });

						collector.stop();
						break;
				}
			});
		}
		catch (error) {
			const msg = await message.reply({content: `**Error:** \`\`\`js\n${String(error.stack.slice(0, 1970))}\n\`\`\``, components: [row]});
			collector.on('collect', async (button) => {

				if (button.user.id != message.author.id) {
					return await button.reply({ content: `${emoji.Error} › **Desculpe**, você precisa **utilizar** o comando para **isto**.`, ephemeral: true });
				}

				switch(button.customId) {
					case 'x':
						await msg.edit({ content: `${emoji.Success} › **Resultado** do eval **fechado** com sucesso.`, components: [] });

						collector.stop();
						break;
				}
			});
		}

  },
};
