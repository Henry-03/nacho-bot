const Op = require('sequelize');
const { Events } = require('discord.js');
const { Users, UserCds, Commands } = require('../dbObjects.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const id = message.author.id;
        // if (id == 555955826880413696) { // rpg bot
        //     if (message.embeds.length > 0) {
        //         const title = message.embeds[0].data.name;
        //         console.log(title);
        //         const fields = message.embeds[0].fields;
        //         for (let field of fields) {

        //         }
        //     }
        // }

        var user = await Users.findOne({ where: { user_id: id }});
        const messageArr = message.content.toLowerCase().split(" ");
        if (!user || message.author.bot || messageArr[1] == 'i' || messageArr[1] == 'p') return;

        if (messageArr[0] == "rpg") {
            const commandList = await Commands.findAll({ attributes: ['name'], raw: true })
            var key = new String();
            var commandName = new String();
            for (const names of commandList) {
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
            if (!key.length) return;
            const command = await Commands.findOne({ where: { name: key }});
            const userCd = await UserCds.findOne({ where: { user_id: id, command_id: command.id } });

            if (command && user.is_reminding) {
                if (!userCd.on_cooldown) {
                    user.toggleCooldown(id, command, true);  
                    setTimeout(() => {
                        message.channel.send(`<@${id}>, \`${commandName}\` is ready`);
                        user.toggleCooldown(id, command, false);
                    }, command.time * 60000)     
                } else message.channel.send(`<@${id}>, \`${commandName}\` is on cooldown`)
            }
        }
    },
};
