const { SlashCommandBuilder } = require('discord.js');
const helperMethods = require('../../helper_methods.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Shows balance of a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Tag of the user to check balance')),
	async execute(interaction) {
		const target = interaction.options.getUser('user') ?? interaction.user;

		return interaction.reply(`${target.tag} has ${helperMethods.getBalance(target.id)}💰`);
	},
};