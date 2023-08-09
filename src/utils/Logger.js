const c = require("colors");

module.exports = {
    
  Database: {
    Success: c.green("[DATABASE] ") + "Conectada com sucesso.",
    Error: c.red("[DATABASE] ") + "Ocorreu um erro ao se conectar.",
  },

  Bot: {
    Success: c.green("[BOT] ") + "Iniciado com sucesso.",
    Error: c.red("[BOT] ") + "Ocorreu um erro ao iniciar.",
    Leave: c.red("[BOT] ") + "O servidor {guild} não é permitido, portanto sai do mesmo."
  },

  Commands: {
    Success: c.green("[COMANDOS] ") + "Carregados com sucesso.",
    Error: c.red("[COMANDOS] ") + "Ocorreu um erro ao carregar os comandos.",
  },
  
};
