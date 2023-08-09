const {
  ChannelType,
  PermissionsBitField,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const discordTranscripts = require("discord-html-transcripts");

const Embed = require("../structures/intEmbed");
const config = require("../../config");
const emoji = require("../utils/Emojis");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const guildDBData = await client.guildDB.findOne({
      guildID: interaction.guild.id,
    });

    let ticketsOpen = guildDBData.ticket.open;
    let ticketsTotal = guildDBData.ticket.total;

    if (interaction.isAnySelectMenu() && interaction.customId === "ticket") {
      const options = interaction.values[0];
      let categoryEmoji;
      switch (options) {
        case "suporte":
          categoryEmoji = "❓";
          break;
        case "denunciadc":
          categoryEmoji = "👮‍♂️";
          break;
        case "sugestaodc":
          categoryEmoji = "⭐";
          break;
        case "suportemine":
          categoryEmoji = "🪓";
          break;
        case "timeline":
          categoryEmoji = "📜";
          break;
        case "denunciamine":
          categoryEmoji = "🚨";
          break;
        case "sugestaomine":
          categoryEmoji = "📩";
          break;
        case "outros":
          categoryEmoji = "🎙️";
          break;
      }

      if (
        interaction.guild.channels.cache.find(
          (channel) =>
            channel.name === `${categoryEmoji}・${interaction.user.username}`
        )
      )
        return interaction.followUp({
          content: `${emoji.Error} › Você **já** possui um **ticket** aberto.`,
          ephemeral: true,
        });
      await interaction.guild.channels
        .create({
          name: `${categoryEmoji}・${interaction.user.username}`,
          type: ChannelType.GuildText,
          parent: guildDBData.ticket.category,
          topic: interaction.user.id,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ViewChannel,
              ],
            },
            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.AttachFiles,
              ],
            },
            {
              id: config.Ticket.Staff,
              allow: [
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.AttachFiles,
              ],
            },
          ],
        })
        .then(async (channel) => {
          interaction.reply({
            content: `${emoji.Success} › Seu ticket foi **aberto** em <#${channel.id}>`,
            ephemeral: true,
          });
          let embed2 = new Embed(interaction).setDescription(
            `${emoji.Info} Olá ${interaction.user}! Seja bem vindo ao seu ticket.\n\n> Aqui você poderá falar diretamento com a nossa equipe e ter o devido suporte. Conte com detalhes o que deseja!`
          );
          const button = new ButtonBuilder()
            .setLabel("Fechar")
            .setCustomId("close")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emoji.Error);

          const row = new ActionRowBuilder().addComponents(button);

          channel.send({ embeds: [embed2], components: [row] });
        });

      await client.guildDB.findOneAndUpdate(
        { guildID: interaction.guild.id },
        {
          $set: {
            "ticket.open": guildDBData.ticket.open + 1,
            "ticket.total": guildDBData.ticket.total + 1,
          },
        }
      );
      ticketsOpen++;
      ticketsTotal++;

      const ticketChannel = interaction.guild.channels.cache.get(
        guildDBData.ticket.channel
      );

      ticketChannel.messages
        .fetch(`${guildDBData.ticket.message}`)
        .then((msg) => {
          const embed = new Embed(interaction)
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

          const row = new ActionRowBuilder().addComponents(menu);

          msg.edit({ embeds: [embed], components: [row] });
        });
    }
    if (interaction.isButton()) {
      if (interaction.customId == "close") {
        interaction.update({ components: [] });
        let ticketsOpen = guildDBData.ticket.open;

        interaction.channel
          .send(`${emoji.Error} | Este ticket será fechado em **5 segundos**.`)
          .then(
            setTimeout(async () => {
              var logchannel = interaction.guild.channels.cache.get(
                config.Ticket.Logs
              );
              var channel = interaction.channel;

              const attachment = await discordTranscripts.createTranscript(
                channel,
                {
                  limit: -1,
                  returnType: "attachment",
                  filename: `transcript_${interaction.channel.topic}.html`,
                  saveImages: false,
                  footerText: "{number} Mensagens exportadas",
                  poweredBy: false,
                }
              );
              const embed = new Embed(interaction)
                .setDescription(
                  `> ${emoji.Files} › **Relatório de Atendimento;**\n- Um novo ticket foi **deletado** nesta loja. Veja as logs **abaixo**.`
                )
                .addFields([
                  {
                    name: `Criado por:`,
                    value: `${emoji.User} <@${interaction.channel.topic}>`,
                    inline: true,
                  },
                  {
                    name: `Deletado por:`,
                    value: `${emoji.Box} <@${interaction.user.id}>`,
                    inline: true,
                  },
                ]);
              logchannel
                .send({
                  embeds: [embed],
                })
                .then(() => {
                  setTimeout(() => {
                    logchannel.send({ files: [attachment] });
                  }, 1000);
                });
              await interaction.channel.delete();

              ticketsOpen = ticketsOpen - 1;

              await client.guildDB.findOneAndUpdate(
                { guildID: interaction.guild.id },
                { $set: { "ticket.open": ticketsOpen } }
              );

              const ticketChannel = interaction.guild.channels.cache.get(
                guildDBData.ticket.channel
              );

              ticketChannel.messages
                .fetch(`${guildDBData.ticket.message}`)
                .then((msg) => {
                  const embed = new Embed(interaction)
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
                          guildDBData.ticket.status
                            ? "**Ativo**."
                            : "**Desativado**."
                        }`,
                        inline: true,
                      },
                    ])
                    .setThumbnail(interaction.guild.iconURL({ size: 2048 }))
                    .setFooter({
                      text: `${client.user.username} © Todos os direitos reservados.`,
                      iconURL: client.user.avatarURL(),
                    })
                    .setImage(
                      `https://skinmc.net/en/achievement/8/Atendimento/Abra+seu+ticket`
                    )

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

                  const row = new ActionRowBuilder().addComponents(menu);
                  if (guildDBData.ticket.status == false)
                    menu.setDisabled(true);
                  msg.edit({ embeds: [embed], components: [row] });
                });
            }, 5000)
          );
      }
    }
  },
};
