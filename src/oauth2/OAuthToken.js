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

export default OAuthToken;
