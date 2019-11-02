import db from '../../loader/db';

const { microdust, Sequelize } = db;

const OAuthToken = microdust.define('oauth_token', {
  accessToken: {
    type: Sequelize.STRING,
    allowNull: false
  },
  accessTokenExpiresAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  refreshToken: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refreshTokenExpiresAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  scope: Sequelize.STRING,
  clientId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

OAuthToken.convert = (token) => ({
  accessToken: token.accessToken,
  accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
  refreshToken: token.refreshToken,
  refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
  client: { id: token.clientId },
  user: { id: token.userId }
});

OAuthToken.convertToSave = (token) => ({
  accessToken: token.accessToken,
  accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
  refreshToken: token.refreshToken,
  refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
  clientId: token.clientId,
  userId: token.userId
});

OAuthToken.convertToAccessToken = (token) => ({
  accessToken: token.accessToken,
  accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
  client: { id: token.clientId },
  user: { id: token.userId }
});

OAuthToken.convertToRefreshToken = (token) => ({
  refreshToken: token.refreshToken,
  refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
  client: { id: token.clientId },
  user: { id: token.userId }
});

export default OAuthToken;
