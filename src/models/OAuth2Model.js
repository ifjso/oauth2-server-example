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

  async getAccessToken(bearerToken) {
    debug('getAccessToken');

    const token = await this.redisClient.hgetall(fmt(formats.token, bearerToken));

    if (!token || token.accessToken !== bearerToken) {
      return;
    }

    debug('getAccessToken: sent access token successfully');

    return {
      ...token
    };
  }

  async getRefreshToken(bearerToken) {
    debug('getRefreshToken');

    const token = await this.redisClient.hgetall(fmt(formats.token, bearerToken));

    if (!token || token.accessToken !== bearerToken) {
      return;
    }


    return {
      ...token
    };
  }

  async getAuthorizationCode(authorizationCode) {
    debug('getAuthorizationCode');

    const code = await this.redisClient.hgetall(fmt(formats.code, authorizationCode));

    code.client = { id: code.clientId };
    code.user = { id: code.userId };
    code.expiresAt = new Date(code.expiresAt);

    debug(code);

    if (!code) {
      return;
    }

    debug('getAuthorizationCode: sent authorization code successfully');

    return {
      ...code
    };
  }

  async getClient(clientId) {
    debug('getClient %s', clientId);

    const client = await this.redisClient.hgetall(fmt(formats.client, clientId));

    debug(client);

    if (!client) {
      return;
    }

    debug('Sent client details successfully');

    return {
      ...client,
      grants: client.grants.split(',')
    };
  }

  async saveToken(token, client, user) {
    debug('saveToken');

    const pipe = this.redisClient.pipeline();

    token.clientId = client.clientId;
    token.userId = user.id;

    const data = {
      ...token,
      client: { id: client.clientId },
      user: { id: user.id }
    };

    debug(token);

    await pipe
      .hmset(fmt(formats.token, token.accessToken), token)
      .hmset(fmt(formats.token, token.refreshToken), token)
      .exec()
      .then(() => {
        debug('saveToken: token %s saved successfully', token);
      });

    return data;
  }

  async saveAuthorizationCode(code, client, user) {
    debug('saveAuthorizationCode');

    code.clientId = client.id;
    code.userId = user.id;

    debug(code);

    const data = { ...code };

    await this.redisClient.hmset(fmt(formats.code, code.authorizationCode), code);

    return data;
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
