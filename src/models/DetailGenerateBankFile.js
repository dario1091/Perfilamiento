
			module.exports = function(sequelize, DataTypes) {
				return sequelize.define('DetailGenerateBankFile', {
					dgbfId: {
						type: DataTypes.INTEGER(11),
						allowNull: false,
						primaryKey: true,
						autoIncrement: true,
						field: 'dgbf_id'
					},
					gebaId: {
						type: DataTypes.INTEGER(11),
						allowNull: true,
						references: {
							model: 'GeneratedBankFiles',
							key: 'geba_id'
						},
						field: 'geba_id'
					},
					dgbfDocumentType: {
						type: DataTypes.STRING(10),
						allowNull: true,
						field: 'dgbf_document_type'
					},
					dgbfDocumentNumber: {
						type: DataTypes.STRING(20),
						allowNull: true,
						field: 'dgbf_document_number'
					},
					dgbfClientName: {
						type: DataTypes.STRING(100),
						allowNull: true,
						field: 'dgbf_client_name'
					},
					dgbfClientLastname: {
						type: DataTypes.STRING(100),
						allowNull: true,
						field: 'dgbf_client_lastname'
					},
					dgbfBankCode: {
						type: DataTypes.STRING(20),
						allowNull: true,
						field: 'dgbf_bank_code'
					},
					dgbfProductType: {
						type: DataTypes.STRING(20),
						allowNull: true,
						field: 'dgbf_product_type'
					},
					dgbfProductoNumber: {
						type: DataTypes.STRING(20),
						allowNull: true,
						field: 'dgbf_producto_number'
					},
					dgbfPayValue: {
						type: DataTypes.STRING(20),
						allowNull: true,
						field: 'dgbf_pay_value'
					},
					dgbfReference: {
						type: DataTypes.STRING(20),
						allowNull: true,
						field: 'dgbf_reference'
					},
					dgbfEmail: {
						type: DataTypes.STRING(80),
						allowNull: true,
						field: 'dgbf_email'
					},
					dgbfDescription: {
						type: DataTypes.STRING(100),
						allowNull: true,
						field: 'dgbf_description'
					},
					dgbfTransactionType: {
						type: DataTypes.STRING(20),
						allowNull: true,
						field: 'dgbf_transaction_type'
					},
					dgbfDocumentoAuth: {
						type: DataTypes.STRING(20),
						allowNull: true,
						field: 'dgbf_documento_auth'
					},
					dgbfOffice: {
						type: DataTypes.STRING(20),
						allowNull: true,
						field: 'dgbf_office'
					},
					dgbfPayDate: {
						type: DataTypes.STRING(20),
						allowNull: true,
						field: 'dgbf_pay_date'
					},
					dgbfPhoneNumber: {
						type: DataTypes.STRING(10),
						allowNull: true,
						field: 'dgbf_phone_number'
					},
					dgbfPscode: {
						type: DataTypes.STRING(20),
						allowNull: true,
						field: 'dgbf_pscode'
					},
					gbbfPin: {
						type: DataTypes.STRING(10),
						allowNull: true,
						field: 'gbbf_pin'
					},
					createdAt: {
						type: DataTypes.DATE,
						allowNull: true,
						field: 'createdAt'
					},
					updatedAt: {
						type: DataTypes.DATE,
						allowNull: true,
						field: 'updatedAt'
					},
					requId: {
						type: DataTypes.INTEGER(11),
						allowNull: true,
						references: {
							model: 'Request',
							key: 'idRequest'
						},
						field: 'requ_id'
					}
				}, {
					tableName: 'DetailGenerateBankFile'
				});
				
			};