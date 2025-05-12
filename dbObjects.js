const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/users.js')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./models/currency_shop.js')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/user_items.js')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

Reflect.defineProperty(Users.prototype, 'addItem', {
	value: async (item, addAmount, id) => {
		const userItem = await UserItems.findOne({
			where: { user_id: id, item_id: item.id },
		});

		if (userItem) {
			userItem.amount += addAmount;
			return userItem.save();
		}

		return UserItems.create({ user_id: id, item_id: item.id, amount: 1 });
	},
});

Reflect.defineProperty(Users.prototype, 'getItems', {
	value: id => {
		return UserItems.findAll({
			where: { user_id: id },
			include: ['item'],
		});
	},
});

module.exports = { Users, CurrencyShop, UserItems };