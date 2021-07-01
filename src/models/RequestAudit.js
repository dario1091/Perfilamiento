module.exports = function (sequelize, DataTypes) {
	return sequelize.define('RequestAudit', {
		reauId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'reau_id'
		},
		requId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'Request',
				key: 'idRequest'
			},
			field: 'requ_id'
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
		reesId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'RequestState',
				key: 'idRequestState'
			},
			field: 'rees_id'
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
		tableName: 'RequestAudit'
	});

};