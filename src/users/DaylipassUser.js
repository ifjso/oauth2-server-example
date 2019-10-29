import db from '../loader/db/mysql';

const { dayp, Sequelize } = db;

const DaylipassUser = dayp.define('tbl_user', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  realname: {
    type: Sequelize.STRING,
    allowNull: true
  },
  mobileNumber: {
    type: Sequelize.STRING,
    allowNull: true
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: true
  },
  birthDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  regDate: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false,
  freezeTableName: true,
  underscored: true
});

DaylipassUser.findByMobileNumber = (mobileNumber) =>
  DaylipassUser.findOne({
    where: {
      mobileNumber: Sequelize.fn('fnc_com_get_encrypt', mobileNumber)
    }
  });

export default DaylipassUser;
