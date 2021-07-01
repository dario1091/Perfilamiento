
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('DetailLoadedBankFiles', {
		dlbfId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'dlbf_id'
		},
		lobfId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'LoadedBankFiles',
				key: 'lobf_id'
			},
			field: 'lobf_id'
		},
		dlbfDocumentType: {
			type: DataTypes.STRING(10),
			allowNull: true,
			field: 'dlbf_document_type'
		},
		dlbfDocumentNumber: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'dlbf_document_number'
		},
		dlbfClientName: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'dlbf_client_name'
		},
		dlbfClientLastname: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'dlbf_client_lastname'
		},
		dlbfBankCode: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'dlbf_bank_code'
		},
		dlbfProductType: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'dlbf_product_type'
		},
		dlbfProductoNumber: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'dlbf_producto_number'
		},
		dlbfPayValue: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'dlbf_pay_value'
		},
		dlbfReference: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'dlbf_reference'
		},
		dlbfEmail: {
			type: DataTypes.STRING(80),
			allowNull: true,
			field: 'dlbf_email'
		},
		dlbfDescription: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'dlbf_description'
		},
		dlbfTransactionType: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'dlbf_transaction_type'
		},
		dlbfDocumentoAuth: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'dlbf_documento_auth'
		},
		dlbfOffice: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'dlbf_office'
		},
		dlbfPayDate: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'dlbf_pay_date'
		},
		dlbfPhoneNumber: {
			type: DataTypes.STRING(10),
			allowNull: true,
			field: 'dlbf_phone_number'
		},
		dlbfPscode: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'dlbf_pscode'
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
		},
		dlbfBank: {
			type: DataTypes.STRING(50),
			allowNull: true,

			field: 'dlbf_bank'
		},
		dlbfState: {
			type: DataTypes.STRING(100),
			allowNull: true,

			field: 'dlbf_state'
		}
	}, {
		tableName: 'DetailLoadedBankFiles'
	});

};