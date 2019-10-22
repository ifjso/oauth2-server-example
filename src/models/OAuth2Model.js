const debug = require('debug')('OAuth2Model');
const Redis = require('ioredis');
const fmt = require('util').format;

const formats = {
  client: 'clients:%s',
  token: 'tokens:%s',
  user: 'users:%s',
  code: 'codes:%s'
};

class OAuth2Model {
  constructor() {
    this.redisClient = new Redis();
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getRefreshToken = this.getRefreshToken.bind(this);
    this.getAuthorizationCode = this.getAuthorizationCode.bind(this);
    this.getClient = this.getClient.bind(this);
    this.saveToken = this.saveToken.bind(this);
    this.saveAuthorizationCode = this.saveAuthorizationCode.bind(this);
    this.revokeToken = this.revokeToken.bind(this);
    this.revokeAuthorizationCode = this.revokeAuthorizationCode.bind(this);
  }

  async getAccessToken(accessToken) {
    debug('getAccessToken');

    const token = await this.redisClient.hgetall(fmt(formats.token, accessToken));

    if (!token || token.accessToken !== accessToken) {
      return;
    }

    debug('getAccessToken: sent access token successfully');

    return {
      ...token
    };
  }

  async getRefreshToken(refreshToken) {
    debug('getRefreshToken');

    const token = await this.redisClient.hgetall(fmt(formats.token, refreshToken));

    if (!token || token.refreshToken !== refreshToken) {
      return;
    }

    debug(token);

    return {
      ...token,
      refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
      client: { id: token.clientId },
      user: { id: token.userId }
    };
  }

  async getAuthorizationCode(authorizationCode) {
    debug('getAuthorizationCode');

    const code = await this.redisClient.hgetall(fmt(formats.code, authorizationCode));

    debug(code);

    if (!code) {
      return;
    }

    debug('getAuthorizationCode: sent authorization code successfully');

    return {
      ...code,
      expiresAt: new Date(code.expiresAt),
      client: { id: code.clientId },
      user: { id: code.uesrId }
    };
  }

  async getClient(clientId, clientSecret) {
    debug('getClient %s %s', clientId, clientSecret);

    // TODO mysql
    // TODO clientSecret가 null이 아니면 검색 조건 쿼리에 포함되어야 함
    const client = await this.redisClient.hgetall(fmt(formats.client, clientId));

    debug(client);

    if (!client) {
      return;
    }

    debug('Sent client details successfully');

    const { secret, ...clonedClient } = client;

    return {
      ...clonedClient,
      redirectUris: client.redirectUris.split(','),
      grants: client.grants.split(',')
    };
  }

  async saveToken(token, client, user) {
    debug('saveToken');

    const pipe = this.redisClient.pipeline();

    const tokenToSave = {
      ...token,
      clientId: client.id,
      userId: user.id
    };

    debug(token);

    // TODO redis expire
    await pipe
      .hmset(fmt(formats.token, token.accessToken), tokenToSave)
      .hmset(fmt(formats.token, token.refreshToken), tokenToSave)
      .exec()
      .then(() => {
        debug('saveToken: token %s saved successfully', tokenToSave);
      });

    return {
      ...tokenToSave,
      client: { id: client.clientId },
      user: { id: user.id }
    };
  }

  async saveAuthorizationCode(code, client, user) {
    debug('saveAuthorizationCode');

    debug(code);

    const codeToSave = {
      ...code,
      clientId: client.id,
      userId: user.id
    };

    // TODO redis expire
    await this.redisClient.hmset(fmt(formats.code, code.authorizationCode), codeToSave);

    return {
      ...codeToSave
    };
  }

  async revokeToken(token) {
    debug('revokeToken');

    const result = await this.redisClient.del(fmt(formats.token, token.refreshToken));
    return result !== 0;
  }

  async revokeAuthorizationCode(code) {
    debug('revokeAuthorizationCode');

    const result = await this.redisClient.del(fmt(formats.code, code.authorizationCode));
    return result !== 0;
  }

  async verifyScope(accessToken, scope) {
    debug('verifyScope');
    return true;
  }
}

module.exports = new OAuth2Model();
