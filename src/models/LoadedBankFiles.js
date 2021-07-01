module.exports = function (sequelize, DataTypes) {
	return sequelize.define('LoadedBankFiles', {
		lobfId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'lobf_id'
		},
		gebaId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'GenerateBankFiles',
				key: 'geba_id'
			},
			field: 'geba_id'
		},
		lobfPath: {
			type: DataTypes.STRING(200),
			allowNull: false,
			field: 'lobf_path'
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
		tableName: 'LoadedBankFiles'
	});

};