const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CommandList = require('./models/commands.js')(sequelize, Sequelize.DataTypes);
require('./models/users.js')(sequelize, Sequelize.DataTypes);
require('./models/user_cd.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const commands = [
		CommandList.upsert({ name: 'hunt', time: 1 }),
		CommandList.upsert({ name: 'adventure adv', time: 60 }),
		CommandList.upsert({ name: 'training tr ultraining ultr', time: 15 }),
		CommandList.upsert({ name: 'working fish net boat bigboat chop axe bowsaw chainsaw mine pickaxe drill dynamite pickup ladder tractor greenhouse', time: 5 }),
		CommandList.upsert({ name: 'farm', time: 10 }),
	];

	await Promise.all(commands);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);