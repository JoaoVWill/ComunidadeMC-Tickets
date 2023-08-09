const Embed = require("../../structures/Embed");

module.exports = {
  name: "ping",
  description: "Retorna a latência do bot",
  aliases: ["pong"],
  async execute({ message, client, config, emoji }) {
    const startDB = process.hrtime();
    await client.shopDB.findOne({ shopID: client.user.id });
    const stopDB = process.hrtime(startDB);
    const pingDB = Math.round((stopDB[0] * 1e9 + stopDB[1]) / 1e6);

    const ping = Date.now() - message.createdTimestamp;

    const embed = new Embed(message)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `> ${emoji.Ping} › **Pong!**\n- Ping do BOT: **${ping}ms**.\n- Banco de Dados: **${pingDB}ms**.`
      )
      .setThumbnail(client.user.avatarURL({ size: 2048 }))
      .setImage(`https://skinmc.net/en/achievement/6/Conex%C3%B5es/Ping+do+Bot%3A+${ping}ms`);
    message.reply({ embeds: [embed] });
  },
};
