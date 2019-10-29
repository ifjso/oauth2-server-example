import db from '../loader/db/mysql';

const { ddr, Sequelize } = db;

const OAuthApp = ddr.define('dtb_oauth_app', {
  client_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  client_secret: {
    type: Sequelize.STRING,
    allowNull: false
  },
  access_token_lifetime: Sequelize.INTEGER,
  refresh_token_lifetime: Sequelize.INTEGER,
  grants: {
    type: Sequelize.STRING,
    allowNull: false
  },
  redirect_uris: {
    type: Sequelize.TEXT,
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

export default OAuthApp;
