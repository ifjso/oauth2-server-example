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
  }
});

OAuthApp.convert = (client) => ({
  id: client.clientId,
  redirectUris: client.redirectUris.split(','),
  grants: client.grants.split(','),
  accessTokenLifetime: Number(client.accessTokenLifetime),
  refreshTokenLifetime: Number(client.refreshTokenLifetime)
});

export default OAuthApp;
