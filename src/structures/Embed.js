const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = function embed(message) {
  const embed = new EmbedBuilder()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
    .setColor(config.Color)
    .setFooter({
      text: `・Comando executado por ${message.author.tag}.`,
      iconURL: message.author.avatarURL(),
    })
    .setThumbnail("https://i.imgur.com/vAZBjQJ.png")
    .setTimestamp();
  return embed;
};
