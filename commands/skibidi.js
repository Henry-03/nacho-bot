const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skibidi')
		.setDescription('skibidi toilet'),
	async execute(interaction) {
		await interaction.reply('what the sigma');
	},
};