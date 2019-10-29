import db from '../loader/db/mysql';

const { ddr, Sequelize } = db;

const OAuthToken = ddr.define('dtb_oauth_token', {
  access_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  access_token_expires_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  refresh_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refresh_token_expires_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  scope: Sequelize.STRING,
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

export default OAuthToken;
