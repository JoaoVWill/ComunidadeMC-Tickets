const config = require("../../config");
const emoji = require("../utils/Emojis");
const Embed = require("../structures/Embed");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot == true) return;

    const prefix = config.Prefix;

    const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
    if (message.content.match(GetMention(client.user.id))) {
      const mentionEmbed = new Embed(message)
        .setDescription(
          `${emoji.Info} **Olá** ${message.author}!\n\n> Você me chamou? Eu sou o Bot Oficial da **${message.guild.name}**.\n\n> ${emoji.Who} Meu prefixo: **${prefix}**`
        )
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.avatarURL(),
        })
        .setImage("https://skinmc.net/en/achievement/13/Ol%C3%A1%21/Posso+ajudar%3F");
      message.reply({ embeds: [mentionEmbed] });
    }

    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();

        const guildDBData = await client.guildDB.findOne({guildID: message.guild.id})
        if(!guildDBData) await client.guildDB.create({guildID: message.guild.id})

      if (client.commands.has(command)) {
        try {
          client.commands
            .get(command)
            .execute({ message, args, client, config, emoji });
        } catch {
          const embed = new Embed(message).setDescription(
            `${emoji.Error} › **Oops!** Parece que ocorreu um **erro** ao executar este **comando**. Peço que **reporte** aos meus desenvolvedores para que seja **resolvido** o mais rápido possível.`
          );
          message.reply({ embeds: [embed] });
        }
      }
    }
  },
};
