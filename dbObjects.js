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

Reflect.defineProperty(Users.prototype, 'setCooldown', {
	value: async (id, command) => {
		const userCd = await UserCds.findOne({
			where: { user_id: id, command_id: command.id },
		});

		if (userCd) {
			userCd.ready_time = Date.now() + command.time * 1000;
			return userCd.save();
		}
	},
});

Reflect.defineProperty(Users.prototype, 'initCooldowns', {
	value: async (id) => {
		const commandList = await Commands.findAll();
		for (const command of commandList) {
			var userCd = await UserCds.create({ user_id: id, 
												command_id: command.id, 
												ready_time: (Date.now() - command.time * 1000).toString(),
												has_timeout: false });
			await userCd.save();
		}
	},
});

let timeout;

Reflect.defineProperty(UserCds.prototype, 'createTimeout', {
	value: function(message, id, commandName, time) {
			timeout = setTimeout(() => {
				message.channel.send(`<@${id}>, \`${commandName}\` is ready`);
				this.setActiveTimeout(false);
				timeout = null;
			}, time * 1000) // Change to 1000 on release	
	}
});

Reflect.defineProperty(UserCds.prototype, 'removeTimeout', {
	value: function() {
		if (timeout) {
			clearTimeout(timeout)
		};
		this.setActiveTimeout(false);		
		timeout = null;
	}
});

Reflect.defineProperty(UserCds.prototype, 'setActiveTimeout', {
	value: async function(bool) {
		this.has_timeout = bool;
		await this.save();
	}
})

module.exports = { Users, Commands, UserCds };