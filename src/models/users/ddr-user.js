import db from '../../configs/db';

const { ddr, Sequelize } = db;

const DDRUser = ddr.define('dtb_user', {
  userId: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  daylipassId: {
    type: Sequelize.INTEGER,
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

DDRUser.findByDaylipassIdAndPin = (daylipassId, pin) =>
  DDRUser.findOne({
    where: {
      daylipassId,
      pin
    }
  });

export default DDRUser;
