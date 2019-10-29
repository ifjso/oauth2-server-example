import db from '../loader/db/mysql';

const { ddr, Sequelize } = db;

const OAuthToken = ddr.define('dtb_oauth_token', {
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

OAuthToken.convert = (token) => ({
  accessToken: token.accessToken,
  accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
  client: { id: token.clientId },
  user: { id: token.userId }
});

OAuthToken.convertToSave = (token) => ({
  accessToken: token.accessToken,
  accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
  clientId: token.clientId,
  userId: token.userId
});

export default OAuthToken;
