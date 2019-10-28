import db from '../loader/db/mysql';

const { ddr, Sequelize } = db;

const DDRUser = ddr.define('dtb_user', {
  user_id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  group_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  daylipass_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  pin: {
    type: Sequelize.STRING,
    allowNull: true
  },
  quit_datetime: {
    type: Sequelize.DATE,
    allowNull: true
  },
  create_datetime: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false,
  freezeTableName: true
});

DDRUser.findByDaylipassIdAndPin = (daylipassId, pin) =>
  DDRUser.findOne({
    where: {
      daylipass_id: daylipassId,
      pin
    }
  });

export default DDRUser;
