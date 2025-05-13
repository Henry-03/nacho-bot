module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		is_reminding: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
			// Change back to false later
		}
	}, {
		timestamps: false,
	});
};