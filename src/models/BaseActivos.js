module.exports = function (sequelize, DataTypes) {
	return sequelize.define('BaseActivos', {
		baacId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'baac_id'
		},
		baacCedulaCliente: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: 'baac_cedula_cliente'
		},
		baacNombreCliente: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'baac_nombre_cliente'
		},
		baacCelularCliente: {
			type: DataTypes.STRING(40),
			allowNull: true,
			field: 'baac_celular_cliente'
		},
		baacCorreoCliente: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'baac_correo_cliente'
		},
		baacDireccionCliente: {
			type: DataTypes.STRING(500),
			allowNull: true,
			field: 'baac_direccion_cliente'
		},
		baacFechaNacimiento: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'baac_fecha_nacimiento'
		},
		baacFechaIngreso: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'baac_fecha_ingreso'
		},
		baacFechaRetiro: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'baac_fecha_retiro'
		},
		baacSueldo: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'baac_sueldo'
		},
		baacScoring: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'baac_scoring'
		},
		baacMontoScoring: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'baac_monto_scoring'
		},
		baacCompany: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'baac_company'
		},
		baacCompanyId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'baac_company_id'
		},
		baacCentroCostos: {
			type: DataTypes.STRING(30),
			allowNull: true,
			field: 'baac_centro_costos'
		},
		baacCiudad: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'baac_ciudad'
		},
		baacCargo: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'baac_cargo'
		},
		baacCuentaBanco: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'baac_cuenta_banco'
		},
		baacCicloNomina: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'baac_ciclo_nomina'
		},
		baacFechaPago: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'baac_fecha_pago'
		},
		baacGenero: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'baac_genero'
		},
    createdAt: {
      type: 'TIMESTAMP',
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    }
	}, {
		tableName: 'BaseActivos'
	});

};