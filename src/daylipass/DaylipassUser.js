export default (sequelize, DataTypes) => sequelize.define('tbl_user', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  realname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mobile_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  birth_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reg_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  freezeTableName: true
});
