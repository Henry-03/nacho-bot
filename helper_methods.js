const { Users } = require('./dbObjects.js');

module.exports = {
	addBalance: async function(id, amount) {
		const user = await Users.findOne({
			where: { user_id: id },
		});
	
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
	
		const newUser = await Users.create({ user_id: id, balance: amount });
		// currency.set(id, newUser);
	
		return newUser;
	},
	
	getBalance: async function(id) {
		const user = await Users.findOne({
			where: { user_id: id },
		});
		return user ? user.balance : 0;
	}
}

