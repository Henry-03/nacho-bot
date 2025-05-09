const Op = require('sequelize');
const { Collection } = require('discord.js');
const { Users } = require('./dbObjects.js');
const currency = new Collection();

module.exports = {
	addBalance: async function(id, amount) {
		const user = currency.get(id);
	
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
	
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
	
		return newUser;
	},
	
	getBalance: function(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	}
}

