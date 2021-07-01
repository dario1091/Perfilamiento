			module.exports = function(sequelize, DataTypes) {
				return sequelize.define('Municipalities', {
					muniId: {
						type: DataTypes.INTEGER(11),
						allowNull: false,
						primaryKey: true,
						autoIncrement: true,
						field: 'muni_id'
					},
					depaId: {
						type: DataTypes.INTEGER(11),
						allowNull: false,
						references: {
							model: 'Departments',
							key: 'depa_id'
						},
						field: 'depa_id'
					},
					muniCode: {
						type: DataTypes.STRING(20),
						allowNull: false,
						field: 'muni_code'
					},
					muniOrder: {
						type: DataTypes.STRING(20),
						allowNull: false,
						field: 'muni_order'
					},
					muniName: {
						type: DataTypes.STRING(45),
						allowNull: false,
						field: 'muni_name'
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
					modelName: 'Municipalities',
					freezeTableName: true,
					timestamps: false
				},{
					tableName: 'Municipalities'
				});
				
			};
