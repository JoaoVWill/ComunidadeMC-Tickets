const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Embed = require("../../structures/Embed");
const ticketSet = require("./Ticket/set");
ticketStatus = require("./Ticket/status");

module.exports = {
  name: "ticket",
  description: "Sistema de atendimento",
  aliases: ["atendimento"],
  async execute({ message, args, config, client, emoji }) {
    if(!message.member.permissions.has("ManageGuild")) return;
    
    const guildDBData = await client.guildDB.findOne({
      guildID: message.guild.id,
    });

    const embed = new Embed(message)
      .setDescription(
        `> ${emoji.Help} › **Sistema de Atendimento**;\n- Receba tickets de atendimento em seu servidor, para que membros possam falar diretamente com a equipe. Utilize os comandos abaixo:\n\n> ${emoji.Command} ›**Comandos**;\n- **ticket set** - *Inicie o sistema de atendimento.*\n- **ticket status** - *Ligue ou desligue o sistema.*`
      )
      .setImage(
        `https://skinmc.net/en/achievement/11/Menth+Store/${guildDBData.ticket.total}+tickets`
      );
    if (!args[0]) return message.reply({ embeds: [embed] });

    if (["set", "channel"].includes(args[0].toLowerCase())) {
      ticketSet.execute({ message, args, config, client, emoji });
    } else if (["status", "on", "off"].includes(args[0].toLowerCase())) {
      ticketStatus.execute({ message, args, config, client, emoji });
    } else {
      return message.reply(
        `${emoji.Error} › Desculpe, **não** encontrei este **comando**.`
      );
    }
  },
};
