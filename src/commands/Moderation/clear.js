module.exports = {
  name: "clear",
  description: "Limpe a quantia de mensagens desejadas.",
  aliases: ["limpar"],
  async execute({ message, args, config, emoji }) {
    if(!message.member.permissions.has("ManageGuild")) return;
    
    const amount = parseInt(args[0]);

    if (!args[0])
      return message.reply(`${emoji.Error} › Você **precisa** inserir a quantia de **mensagens** a serem **apagadas**.`);
    if (isNaN(amount))
      return message.reply(`${emoji.Error} › Isto **não** é um **número**.`);
    if (amount <= 0 || amount > 99)
      return message.reply(`${emoji.Error} › A **quantia** deve ser de **1** a **99**.`);

    message.channel.bulkDelete(amount, true).catch((err) => {
      console.error(err);
      message.reply(`${emoji.Error} › Ocorreu um **erro** ao limpar as **mensagens** solicitadas.`);
    });

    return message.channel
      .send(
        `${emoji.Success} › O **membro** ${message.author} limpou **${amount}** mensagens.`
      )
      .then((msg) => {
        setTimeout(() => {
          return msg.delete();
        }, 5000);
      });
  },
};
