import db from '../loader/db/mysql';

const { dayp, Sequelize } = db;

const DaylipassUser = dayp.define('tbl_user', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  realname: {
    type: Sequelize.STRING,
    allowNull: true
  },
  mobile_number: {
    type: Sequelize.STRING,
    allowNull: true
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: true
  },
  birth_date: {
    type: Sequelize.DATE,
    allowNull: true
  },
  reg_date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false,
  freezeTableName: true
});

export default DaylipassUser;
