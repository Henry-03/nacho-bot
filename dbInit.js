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
		CommandList.upsert({ name: 'daily', time: 1440 }),
		CommandList.upsert({ name: 'weekly', time: 10080 }),
		CommandList.upsert({ name: 'duel', time: 120 }),
		CommandList.upsert({ name: 'dungeon dung minintboss', time: 720 }),
		CommandList.upsert({ name: '*buy ed lb', time: 180 }),
		CommandList.upsert({ name: '*card hand', time: 1440 }),
		CommandList.upsert({ name: '*horse breed', time: 1440 }),
		// quest, arena, vote
	];

	await Promise.all(commands);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);