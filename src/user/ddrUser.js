export default (sequelize, DataTypes) => sequelize.define('dtb_user', {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  daylipass_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quit_datetime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  create_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  freezeTableName: true
});
