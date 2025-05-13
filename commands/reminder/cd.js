const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { Commands } = require('../../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cd')
		.setDescription('Display all commands'),
	async execute(interaction) {
		const commands = await Commands.findAll();
	    return interaction.reply(codeBlock(commands.map(i => `${i.name}: ${i.time}s`).join('\n')));
	},
};