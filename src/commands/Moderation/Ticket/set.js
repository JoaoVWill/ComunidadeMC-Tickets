const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const Embed = require("../../../structures/Embed");

module.exports = {
  async execute({ message, client, args, config, emoji }) {
    if (!message.member.permissions.has("ManageGuild")) return;

    const guildDBData = await client.guildDB.findOne({
      guildID: message.guild.id,
    });

    const filter = (m) => m.author.id === message.author.id;

    message.reply(
      `${emoji.Box} › Em qual **canal** deseja iniciar o **sistema de atendimento**?`
    );
    const channelCollector = message.channel.createMessageCollector({
      filter,
      time: 60000,
      max: 1,
    });

    channelCollector.on("collect", async (msg) => {
      const channel =
        msg.mentions.channels.first() ||
        message.guild.channels.cache.get(msg.content);

      if (!channel)
        return message.reply(
          `${emoji.Error} › Desculpe, **não** encontrei este **canal**.`
        );

      const categoryCollector = message.channel.createMessageCollector({
        filter,
        time: 60000,
        max: 1,
      });

      message.reply(
        `${emoji.Box} › Em qual **categoria** deseja receber os **tickets**?`
      );

      categoryCollector.on("collect", async (msg) => {
        const category = message.guild.channels.cache.get(msg.content);
        if (category.type !== 4)
          return message.reply(
            `${emoji.Error} › Desculpe, **não** encontrei esta **categoria**.`
          );

        const embed = new Embed(message)
          .setAuthor({
            name: "Central de Atendimento",
            iconURL: client.user.avatarURL(),
          })
          .setDescription(
            `${emoji.Info} Olá! Seja bem vindo a Central de Atendimento do **Boteco do Henrique**.\n\n> Deseja um atendimento com o nosso time? Inicie seu atendimento selecionando no menu a categoria de atendimento, assim será criado seu canal de atendimento com nosso time e logo irão de responder`
          )
          .addFields([
            {
              name: "Tickets:",
              value: `> ${emoji.Files} Abertos: **${guildDBData.ticket.open}**\n> ${emoji.Folder} Total: **${guildDBData.ticket.total}**`,
              inline: true,
            },
            {
              name: "Status:",
              value: `> ${emoji.Status} ${
                guildDBData.ticket.status ? "**Ativo**." : "**Desativado**."
              }`,
              inline: true,
            },
          ])
          .setImage(
            `https://skinmc.net/en/achievement/8/Atendimento/Abra+seu+ticket`
          )
          .setFooter({
            text: `${client.user.username} © Todos os direitos reservados.`,
            iconURL: client.user.avatarURL(),
          });

        const menu = new StringSelectMenuBuilder()
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
              value: "sugestaomine",
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

        if (guildDBData.ticket.status == false) menu.setDisabled(true);
        const row = new ActionRowBuilder().addComponents(menu);

        const mensagem = await channel.send({
          embeds: [embed],
          components: [row],
        });
        await client.guildDB.findOneAndUpdate(
          { guildID: message.guild.id },
          {
            $set: {
              "ticket.message": mensagem.id,
              "ticket.channel": channel.id,
              "ticket.category": category.id,
            },
          }
        );
        return msg.reply(
          `${emoji.Success} › O sistema foi **iniciado** no canal <#${channel.id}>`
        );
      });
    });
  },
};
