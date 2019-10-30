import db from '../../configs/db';

const { ddr, Sequelize } = db;

const AuthorizationCode = ddr.define('dtb_authorization_code', {
  authorizationCode: {
    field: 'code',
    type: Sequelize.STRING,
    allowNull: false
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  redirectUri: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  grants: {
    type: Sequelize.STRING,
    allowNull: false
  },
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

AuthorizationCode.convert = (code) => ({
  authorizationCode: code.authorizationCode,
  expiresAt: new Date(code.expiresAt),
  redirectUri: code.redirectUri,
  client: { id: code.clientId },
  user: { id: code.userId }
});

export default AuthorizationCode;
