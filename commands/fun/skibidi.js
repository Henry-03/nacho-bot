const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skibidi')
		.setDescription('skibidi toilet')
		.addBooleanOption(option =>
			option
				.setName('how')
				.setDescription('are you sigma')
		),
	async execute(interaction) {
		const how = interaction.options.getBoolean('how');
		if (how) {
			await interaction.reply('oiiaioiiiai');
		} else {
			await interaction.reply('what the sigma');
		}
	},
};