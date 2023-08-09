const Embed = require("../../../structures/Embed");
const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  async execute({ message, client, args, config, emoji }) {
    if(!message.member.permissions.has("ManageGuild")) return;
    
    const guildDBData = await client.guildDB.findOne({
      guildID: message.guild.id,
    });

    const ticketChannel = message.guild.channels.cache.get(
      guildDBData.ticket.channel
    );

    const ticketEmbed = new Embed(message)
      .setAuthor({
        name: "Central de Atendimento",
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `${emoji.Info} Olá! Seja bem vindo a Central de Atendimento do **Boteco do Henrique**.\n\n> Deseja um atendimento com o nosso time? Inicie seu atendimento selecionando no menu a categoria de atendimento, assim será criado seu canal de atendimento com nosso time e logo irão de responder`
      )
      .setImage(`https://skinmc.net/en/achievement/8/Atendimento/Abra+seu+ticket`)
      .setFooter({
        text: `${client.user.username} © Todos os direitos reservados.`,
        iconURL: client.user.avatarURL(),
      });

    const ticketRow = new ActionRowBuilder();
    const ticketMenu = new StringSelectMenuBuilder()
      .setCustomId("ticket")
      .setPlaceholder("Selecione aqui.")
      .addOptions([
        {
          label: "Suporte",
          description: "Se precisar de ajuda ou tiver dúvida com o servidor do Discord.",
          value: "suporte",
          emoji: "❓",
        },
        {
          label: "Denúncia Discord",
          description:
            "Caso queira denunciar algo/alguém.",
          value: "denunciadc",
          emoji: "👮‍♂️",
        },
        {
          label: "Sugestão Discord",
          description: "Sugestão para melhorar nosso servidor.",
          value: "sugestaodc",
          emoji: "⭐",
        },
        {
          label: "Suporte Minecraft",
          description: "Se precisar de ajuda em relação ao nosso servidor de Minecraft.",
          value: "suportemine",
          emoji: "🪓",
        },
        {
          label: "Timeline Minecraft",
          description: "Sugestão para a Timeline do Minecraft.",
          value: "timeline",
          emoji: "📜",
        },
        {
          label: "Denúncia Minecraft",
          description:
            "Caso queira denunciar um player do servidor.",
          value: "denunciamine",
          emoji: "🚨",
        },
        {
          label: "Sugestão Minecraft",
          description:
            "Sugestão para o servidor de Minecraft.",
          value: "denunciamine",
          emoji: "📩",
        },
        {
          label: "Outros",
          description:
            "Precisa discutir algo que não está acima? Clique aqui.",
          value: "outros",
          emoji: "🎙️",
        },
      ]);

    if (guildDBData.ticket.status == true) {
      await client.guildDB.findOneAndUpdate(
        { guildID: message.guild.id },
        { $set: { "ticket.status": false } }
      );
      message.reply(`${emoji.Success} | O sistema foi **desligado** com sucesso.`);
      ticketChannel.messages
        .fetch(`${guildDBData.ticket.message}`)
        .then(async (msg) => {
          ticketEmbed.addFields([
            {
              name: "Tickets:",
              value: `> ${emoji.Files} Abertos: **${guildDBData.ticket.open}**\n> ${emoji.Folder} Total: **${guildDBData.ticket.total}**`,
              inline: true,
            },
            {
              name: "Status:",
              value: `> ${emoji.Status} Fora de Funcionamento.`,
              inline: true,
            },
          ])
          ticketMenu.setDisabled(true);
          ticketRow.setComponents([ticketMenu]);
          await msg.edit({ embeds: [ticketEmbed], components: [ticketRow] });
        });
    } else {
      await client.guildDB.findOneAndUpdate(
        { guildID: message.guild.id },
        { $set: { "ticket.status": true } }
      );
      message.reply(`${emoji.Success} | O sistema foi **ligado** com sucesso.`);
      ticketChannel.messages
        .fetch(`${guildDBData.ticket.message}`)
        .then(async (msg) => {
          ticketEmbed.addFields([
            {
              name: "Tickets:",
              value: `> ${emoji.Files} Abertos: **${guildDBData.ticket.open}**\n> ${emoji.Folder} Total: **${guildDBData.ticket.total}**`,
              inline: true,
            },
            {
              name: "Status:",
              value: `> ${emoji.Status} Em Funcionamento.`,
              inline: true,
            },
          ])
          ticketRow.setComponents([ticketMenu]);
          await msg.edit({ embeds: [ticketEmbed], components: [ticketRow] });
        });
    }
    return;
  },
};
