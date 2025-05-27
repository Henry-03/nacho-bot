module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_cd', {
		user_id: DataTypes.STRING,
		command_id: DataTypes.INTEGER,
		timeout_id: DataTypes.INTEGER,
	}, {
		timestamps: false,
	});
};