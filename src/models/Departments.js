			module.exports = function(sequelize, DataTypes) {
				return sequelize.define('Departments', {
					depaId: {
						type: DataTypes.INTEGER(11),
						allowNull: false,
						primaryKey: true,
						autoIncrement: true,
						field: 'depa_id'
					},
					depaCode: {
						type: DataTypes.STRING(12),
						allowNull: false,
						field: 'depa_code'
					},
					depaName: {
						type: DataTypes.STRING(120),
						allowNull: false,
						field: 'depa_name'
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
					modelName: 'Departments',
					freezeTableName: true,
					timestamps: false
				},{
					tableName: 'Departments'
				});
				
			};