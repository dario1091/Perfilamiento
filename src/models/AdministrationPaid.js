
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('AdministrationPaid', {
		adpaId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'adpa_id'
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
		requId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'Request',
				key: 'idRequest'
			},
			field: 'requ_id'
		},
		adpaYearMont: {
			type: DataTypes.STRING(7),
			allowNull: false,
			field: 'adpa_year_mont'
		},
		adpaValue: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: 'adpa_value'
		},

		adpaIsapproved: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			field: 'adpa_isapproved',
			defaultValue: false

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
		tableName: 'AdministrationPaid'
	});

};