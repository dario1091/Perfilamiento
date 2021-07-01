module.exports = function (sequelize, DataTypes) {
	return sequelize.define('CustomerAudit', {
		cuauId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'cuau_id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'User',
				key: 'idUser'
			},
			field: 'user_id'
		},
		cuauJsonUpdated: {
			type: DataTypes.JSON,
			allowNull: false,
			field: 'cuau_json_updated'
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
		tableName: 'CustomerAudit'
	});

};