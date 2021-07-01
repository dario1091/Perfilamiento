module.exports = function (sequelize, DataTypes) {
	return sequelize.define('OverdraftReasons', {
		ovreId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			field: 'ovre_id'
		},
		ovreDescription: {
			type: DataTypes.STRING(200),
			allowNull: false,
			field: 'ovre_description'
		},
		ovreState: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0',
			field: 'ovre_state'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'updatedAt'
		}
	}, {
		sequelize,
		modelName: 'OverdraftReasons',
		freezeTableName: true,
		timestamps: false
	}, {
		tableName: 'OverdraftReasons'
	});

};
