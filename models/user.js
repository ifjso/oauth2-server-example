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
  email: {
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
});

User.findByEmailAndPin = (email, pin) =>
  User.findOne({
    where: {
      email,
      pin
    }
  });

export default User;
