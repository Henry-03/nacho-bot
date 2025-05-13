module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_cd', {
		user_id: DataTypes.STRING,
		command_id: DataTypes.INTEGER,
		on_cooldown: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		}
	}, {
		timestamps: false,
	});
};