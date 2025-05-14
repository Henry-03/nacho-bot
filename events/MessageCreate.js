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
            const command = await Commands.findOne({ where: { name: messageArr[1]}});
            const userCd = await UserCds.findOne({ where: { user_id: id, command_id: command.id } });

            if (command && user.is_reminding) {
                if (!userCd.on_cooldown) 
                {
                    user.toggleCooldown(id, command);  
                    setTimeout(() => {
                        message.channel.send(`<@${id}>, \`${command.name}\` is ready`);
                        user.toggleCooldown(id, command);
                    }, command.time * 1000)     
                } else message.channel.send(`<@${id}>, \`${command.name}\` is on cooldown`)
            }
        }
    },
};
