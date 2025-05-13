const Op = require('sequelize');
const { Events } = require('discord.js');
const { Users, UserCds, Commands } = require('../dbObjects.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        
        const messageArr = message.content.toLowerCase().split(" ");

        if (messageArr[0] == "rpg") {
            const id = message.author.id;
            const user = await Users.findOne({ where: { user_id: id }});
            const command_id = await Commands.findOne({ where: { name: messageArr[1]}});
            const command = await UserCds.findOne({ where: { user_id: id, command_id: command_id } });
            console.log(command);
            if (command_id && user.is_reminding) {
                //if (!command.on_cooldown) {
                    // user.toggleCooldown(user.user_id, command);  
                    setTimeout(() => {
                        message.channel.send(`<@${id}>, \`${command_id.name}\` is ready`);
                        // user.toggleCooldown(user.user_id, command);
                    }, command_id.time * 6000)     
                // } else console.log('on cooldown');
            }
        }
    },
};
