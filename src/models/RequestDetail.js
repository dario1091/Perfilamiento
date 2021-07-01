
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('RequestDetail', {
		redeId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'rede_id'
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
		redeDate: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'rede_date'
		},
		redeName: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: 'rede_name'
		},
		redeOrder: {
			type: DataTypes.STRING(2),
			allowNull: false,
			field: 'rede_order'
		},
		redeTotalFee: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: 'rede_total_fee'
		},
		redeCapital: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: 'rede_capital'
		},
		redeInterest: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: 'rede_interest'
		},
		redeAdminFee: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: 'rede_admin_fee'
		},
		redeAdminIva: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: 'rede_admin_iva'
		},
		redeIvaPorcentage: {
			type: DataTypes.STRING(5),
			allowNull: false,
			field: 'rede_iva_porcentage'
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
		tableName: 'RequestDetail'
	});

};