
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Configuration', {
    confId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'conf_id'
    },
    confName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'conf_name'
    },
    confDescription: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'conf_description'
    },
    confStrValue: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'conf_str_value'
    },
    confValue: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'conf_value'
    },
    createdAt: {
      type: 'TIMESTAMP',
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    }
  }, {
    tableName: 'Configuration'
  });

};