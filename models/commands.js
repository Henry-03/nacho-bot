const { time } = require("discord.js");

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('commands', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		time: {
			type: DataTypes.INTEGER,
			allowNull: false,
		}
	}, {
		timestamps: false,
	});
};