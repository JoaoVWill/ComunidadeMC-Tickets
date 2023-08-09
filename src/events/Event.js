class Event {
    constructor(name) {
      this.name = name;
    }
  
    async execute() {
      throw new Error(`O evento ${this.name} não implementa o método execute.`);
    }
  }
  
  module.exports = Event;