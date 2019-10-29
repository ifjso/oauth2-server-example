import db from '../loader/db/mysql';

const { ddr, Sequelize } = db;

const AuthorizationCode = ddr.define('dtb_authorization_code', {
  code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  expires_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  redirect_uri: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  grants: {
    type: Sequelize.STRING,
    allowNull: false
  },
  client_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  create_datetime: {
    type: Sequelize.DATE,
    allowNull: false
  },
  update_datetime: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

export default AuthorizationCode;
