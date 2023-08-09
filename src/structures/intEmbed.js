const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = function embed(interaction) {
  const embed = new EmbedBuilder()
    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
    .setColor(config.Color)
    .setFooter({
      text: `・Eleve sua experiência.`,
      iconURL: interaction.guild.iconURL(),
    })
    .setThumbnail("https://i.imgur.com/vAZBjQJ.png")
    .setTimestamp();
  return embed;
};
