module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_cd', {
		user_id: DataTypes.STRING,
		command_id: DataTypes.INTEGER,
		ready_time: DataTypes.STRING,
		has_timeout: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	}, {
		timestamps: false,
	});
};