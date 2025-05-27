const { SlashCommandBuilder } = require('discord.js');
const { UserCds, timeout } = require('../../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cdarray')
		.setDescription('Check the timeout array'),
	async execute(interaction) {
        for (cd of timeout) {
            console.log(cd)
        }
	    return interaction.reply(`Length of timeout array is ${timeout.length}.`)
    }
};