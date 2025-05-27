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

const tps = 1000; // Just change this

Reflect.defineProperty(Users.prototype, 'initCooldowns', {
	value: async (id) => {
		const commandList = await Commands.findAll();
		for (const command of commandList) {
			var userCd = await UserCds.create({ user_id: id, 
												command_id: command.id, 
												timeout_id: 0 });
			await userCd.save();
		}
	},
});

const timeout = [''];
// Store timeout in array instead of 1 variable. 
// timeout[0] is always occupied by placeholder.

Reflect.defineProperty(UserCds.prototype, 'createTimeout', {
	value: async function(message, id, commandName, time, force) {
		const userCd = this;
		if (force || !timeout[userCd.timeout_id]) {
			// set index to targeted timeout slot if force and already has existing timeout
			var index = (force && userCd.timeout_id != 0) ? userCd.timeout_id : timeout.indexOf(undefined);
			if (index == -1) index = timeout.length;
			
			userCd.timeout_id = index;
			await userCd.save();

			startTimeout(userCd, index, message, id, commandName, time, sendReminderMsg);
		}
	}
});

Reflect.defineProperty(UserCds.prototype, 'removeTimeout', {
	value: async function(id) {
		const userCd = this;
		clearTimeout(timeout[id]);
		timeout[id] = undefined;	
		userCd.timeout_id = 0;
		await userCd.save();
	}
});

function startTimeout(userCd, index, message, id, commandName, time, callback) {
	if (timeout[index]) {clearTimeout(timeout[index]);}
	timeout[index] = setTimeout(async () => {
		callback(message, id, commandName);
		await userCd.removeTimeout(index);
	}, time * tps);
}

function sendReminderMsg(message, id, commandName) {
	message.channel.send(`<@${id}>, \`${commandName}\` is ready`);
}

module.exports = { Users, Commands, UserCds, timeout };