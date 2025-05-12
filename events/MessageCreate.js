const { Events } = require('discord.js');
const helperMethods = require('../helper_methods.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        if (message.content.toLowerCase() == "test") {
            setTimeout(() => {
                message.channel.send("test");
            }, 5000)    
        }

        await helperMethods.addBalance(message.author.id, 100);
    },
};
