const Op = require('sequelize');
const { Events } = require('discord.js');
const { Users, UserCds, Commands } = require('../dbObjects.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const id = message.author.id;
        var user = await Users.findOne({ where: { user_id: id }});
        if (!user || message.author.bot) return;
        
        const messageArr = message.content.toLowerCase().split(" ");

        if (messageArr[0] == "rpg") {
            const commandList = await Commands.findAll({ attributes: ['name'], raw: true })
            var key = new String();
            var commandName = new String();
            for (const names of commandList) {
                console.log(names.name);
                if (names.name[0] != '*') {
                    if (names.name.indexOf(messageArr[1]) > -1) {
                        key = names.name;
                        commandName = messageArr[1];
                        break;
                    }  
                } else { // Commands marked with * must be exact match
                    if (message.content.toLowerCase().slice(4, 3+names.name.length) == names.name.slice(1)) {
                        key = names.name;
                        commandName = key.slice(1);
                        break;
                    }
                }
            }
            if (!key) return;
            const command = await Commands.findOne({ where: { name: key }});
            const userCd = await UserCds.findOne({ where: { user_id: id, command_id: command.id } });

            if (command && user.is_reminding) {
                if (!userCd.on_cooldown) 
                {
                    user.toggleCooldown(id, command);  
                    setTimeout(() => {
                        message.channel.send(`<@${id}>, \`${commandName}\` is ready`);
                        user.toggleCooldown(id, command);
                    }, command.time * 20)     
                } else message.channel.send(`<@${id}>, \`${commandName}\` is on cooldown`)
            }
        }
    },
};
