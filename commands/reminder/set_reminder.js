const { SlashCommandBuilder } = require('discord.js');
const { Users } = require('../../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setreminder')
		.setDescription('Toggles reminder')
		.addBooleanOption(option =>
			option
				.setName('toggle')
				.setDescription('Toggles reminder')
				.setRequired(true)
		),
	async execute(interaction) {
		const toggle = interaction.options.getBoolean('toggle');
		var user = await Users.findOne({ where: { user_id: interaction.user.id }, })
		if (!user) {
			user = await Users.create({ user_id: interaction.user.id });
			user.initCooldowns(interaction.user.id);
			return interaction.reply(`Reminders for ${interaction.user.tag} is now set to \`${toggle}\`.\n` +
									"It is recommended to run `rpg cd` to refresh your command cooldowns.")
		}
		toggleReminder(user, toggle);
	    return interaction.reply(`Reminders for ${interaction.user.tag} is now set to \`${toggle}\`.`);
	},
}

function toggleReminder(user, toggle) {
	user.is_reminding = toggle
	return user.save();
}