const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skibidi')
		.setDescription('skibidi toilet'),
	async execute(interaction) {
		console.log('what the sigma');
		await interaction.reply('what the sigma');
	},
};