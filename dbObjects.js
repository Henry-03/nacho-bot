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

UserCds.belongsTo(Commands, { foreignKey: 'command_id', as: 'command'});

Reflect.defineProperty(Users.prototype, 'toggleCooldown', {
	value: async (id, command, bool) => {
		const userCd = await UserCds.findOne({
			where: { user_id: id, command_id: command.id },
		});

		if (userCd) {
			userCd.on_cooldown = bool;
			return userCd.save();
		}
	},
});

Reflect.defineProperty(Users.prototype, 'initCooldowns', {
	value: async (id) => {
		const commandList = await Commands.findAll();
		for (const command of commandList) {
			var userCd = await UserCds.create({ user_id: id, command_id: command.id});
			await userCd.save();
		}
	},
});

module.exports = { Users, Commands, UserCds };