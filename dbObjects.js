const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/users.js')(sequelize, Sequelize.DataTypes);
const Commands = require('./models/commands.js')(sequelize, Sequelize.DataTypes);
const UserCds = require('./models/user_cd.js')(sequelize, Sequelize.DataTypes);

UserCds.belongsTo(Commands, { foreignKey: 'command_id', as: 'command' });

Reflect.defineProperty(Users.prototype, 'toggleCooldown', {
	value: async (id, command) => {
		const userCd = await UserCds.findOne({
			where: { user_id: id, command_id: command.id },
		});

		if (userCd) {
			userCd.on_cooldown = !userCd.on_cooldown;
			return userCds.save();
		}

		// return UserItems.create({ user_id: id, item_id: item.id, amount: 1 });
		return;
	},
});

Reflect.defineProperty(Users.prototype, 'getCooldowns', {
	value: id => {
		return UserCds.findAll({
			where: { user_id: id },
			include: ['command'],
		});
	},
});

module.exports = { Users, Commands, UserCds };