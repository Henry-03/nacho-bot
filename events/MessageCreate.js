const Op = require('sequelize');
const { Events } = require('discord.js');
const { Users, UserCds, Commands } = require('../dbObjects.js');
const { CommandInteraction } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const id = message.author.id;
        if (id == 555955826880413696) { // rpg bot
            if (message.embeds.length > 0) {
                const embed = message.embeds[0];
                try {
                    var title = embed.data.author.name
                } catch (error) {return;}
                if (title.includes('cooldowns')) {
                    await ReadCooldowns(message);
                    return;
                }
            }
        }

        const user = await Users.findOne({ where: { user_id: id }});
        const messageArr = message.content.toLowerCase().split(" ");
        if (!user || message.author.bot || messageArr[1] == 'i' || messageArr[1] == 'p' || messageArr[1] == 'rd') return;

        if (messageArr[0] == "rpg") {
            const { key, commandName } = await FindCommand(messageArr[1], message);
            if (!key.length) return;

            const command = await Commands.findOne({ where: { name: key }});
            const userCd = await UserCds.findOne({ where: { user_id: id, command_id: command.id } });

            if (user.is_reminding && userCd.timeout_id == 0) {
                await userCd.createTimeout(message, id, commandName, command.time, false);     
            }
        }
    },
};

async function ReadCooldowns(message) {
    const user_id = message.embeds[0].data.author.icon_url.split("/")[4] // That's certainly one way of doing this lmao
    const user = await Users.findOne({ where: { user_id: user_id } })
    if (!user) return;
    for (field of message.embeds[0].data.fields) {
        var commandLines = field.value.split("\n");
        for (var commandLine of commandLines) {
            var cooldownName = commandLine.split('**')[1].replaceAll("`","");
            if (cooldownName.includes("|")) cooldownName = cooldownName.split(' |')[0];
            switch(cooldownName) { // Handling special commands
                case "lootbox": cooldownName = 'buy ed lb'; break;
                case "chop": cooldownName = 'working'; break;
                case "horse breeding": cooldownName = 'horse breed'; break;
                default: break;
            }
            const {key, commandName} = await FindCommand(cooldownName);
            if (!key.length) continue;
            const command = await Commands.findOne({ where: { name: key }});
            const userCd = await UserCds.findOne({ where: { user_id: user_id, command_id: command.id } });
            if (commandLine.includes('clock4')) {
                if (user.is_reminding) {
                    const time = ReadTime(commandLine);
                    await userCd.createTimeout(message, user_id, commandName, time, true);
                }
            } else { // Force ready command?
                if (userCd.timeout_id != 0) await userCd.removeTimeout(userCd.timeout_id);
            }
        }
    }
}

async function FindCommand(commandQuery, message) {
    const commandList = await Commands.findAll({ attributes: ['name'], raw: true })
    var key = new String();
    var commandName = new String();
    for (const names of commandList) {
        if (names.name[0] != '*') {
            const nameList = names.name.split(" ");
            if (nameList.includes(commandQuery)) {
                key = names.name;
                commandName = commandQuery;
                break;
            }  
        } else { // Commands marked with * must be exact match
            if (message != undefined) {
                if (message.content.toLowerCase().slice(4, 3+names.name.length) == names.name.slice(1)) {
                    key = names.name;
                    commandName = key.slice(1);
                    break;
                }
            } else {
                if (commandQuery == names.name.slice(1)) {
                    key = names.name;
                    commandName = key.slice(1);
                    break;
                }
            }
        }
    }
    return { key, commandName };
}

function ReadTime(commandLine) {
    const timeString = commandLine.split('**')[3].split(" ");
        let time = 0;
        for (let item of timeString) {
            if (item[item.length - 1] == 'h') {
                time = time * 24 + Number(item.substring(0, item.length - 1));
            } else {
                time = time * 60 + Number(item.substring(0, item.length - 1));
            }
        }
        return time;
}

