const { SlashCommandBuilder } = require('discord.js');
const { UserCds } = require('../../dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Force reset all cooldowns'),
	async execute(interaction) {
		const cds = await UserCds.findAll({ where: { user_id: interaction.user.id }});
		for (cd of cds) {
			if (cd.timeout_id != 0) cd.removeTimeout(cd.timeout_id)	
		}
	    return interaction.reply(`Forced reset all cooldowns for <@${interaction.user.id}>.`)
	},
};