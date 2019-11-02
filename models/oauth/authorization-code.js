import db from '../../loader/db';

const { microdust, Sequelize } = db;

const AuthorizationCode = microdust.define('authorization_code', {
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
  clientId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

AuthorizationCode.convert = (code) => ({
  authorizationCode: code.authorizationCode,
  expiresAt: new Date(code.expiresAt),
  redirectUri: code.redirectUri,
  client: { id: code.clientId },
  user: { id: code.userId }
});

AuthorizationCode.convertToSave = ({ code, client, user }) => ({
  ...code,
  clientId: client.id,
  userId: user.id
});

export default AuthorizationCode;
