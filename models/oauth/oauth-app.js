import db from '../../loader/db';

const { microdust, Sequelize } = db;

const OAuthApp = microdust.define('oauth_app', {
  clientId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  clientSecret: {
    type: Sequelize.STRING,
    allowNull: false
  },
  accessTokenLifetime: Sequelize.INTEGER,
  refreshTokenLifetime: Sequelize.INTEGER,
  grants: {
    type: Sequelize.STRING,
    allowNull: false
  },
  redirectUris: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  createDatetime: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updateDatetime: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true,
  underscored: true
});

export default OAuthApp;
