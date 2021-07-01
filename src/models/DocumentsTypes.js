			module.exports = function(sequelize, DataTypes) {
				return sequelize.define('DocumentsTypes', {
					dotyId: {
						type: DataTypes.INTEGER(11),
						allowNull: false,
						primaryKey: true,
						autoIncrement: true,
						field: 'doty_id'
					},
					dotyDescription: {
						type: DataTypes.STRING(50),
						allowNull: false,
						field: 'doty_description'
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
					modelName: 'DocumentsTypes',
					freezeTableName: true,
					timestamps: false
				},{
					tableName: 'DocumentsTypes'
				});
				
			};