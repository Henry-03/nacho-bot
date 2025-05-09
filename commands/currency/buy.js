const { Op } = require('sequelize');
const { SlashCommandBuilder } = require('discord.js');
const { Users, CurrencyShop } = require('../../dbObjects.js');
const helperMethods = require('../../helper_methods.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy an item in the shop')
		.addStringOption(option =>
			option.setName('item')
				.setDescription('Name of the item to buy')),
	async execute(interaction) {
		const itemName = interaction.options.getString('item');
	    const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });

	    if (!item) return interaction.reply(`That item doesn't exist.`);
	    if (item.cost > helperMethods.getBalance(interaction.user.id)) {
		    return interaction.reply(`You currently have ${helperMethods.getBalance(interaction.user.id)}, but the ${item.name} costs ${item.cost}!`);
	    }

	    const user = await Users.findOne({ where: { user_id: interaction.user.id } });
	    helperMethods.addBalance(interaction.user.id, -item.cost);
	    await user.addItem(item);

	    return interaction.reply(`You've bought: ${item.name}.`);},
};


