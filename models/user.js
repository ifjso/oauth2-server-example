import db from '../loader/db';

const { microdust, Sequelize } = db;

const User = microdust.define('user', {
  userId: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  mobileNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pin: {
    type: Sequelize.STRING,
    allowNull: true
  },
  quitDatetime: {
    type: Sequelize.DATE,
    allowNull: true
  },
  createDatetime: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false,
  freezeTableName: true,
  underscored: true
});

User.findByMobileNumberAndPin = (mobileNumber, pin) =>
  User.findOne({
    where: {
      mobileNumber,
      pin
    }
  });

export default User;
