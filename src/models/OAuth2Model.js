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
    this.getAuthorizationCode = this.getAuthorizationCode.bind(this);
    this.saveAuthorizationCode = this.saveAuthorizationCode.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getClient = this.getClient.bind(this);
    this.getRefreshToken = this.getRefreshToken.bind(this);
    this.saveToken = this.saveToken.bind(this);
  }

  async saveAuthorizationCode(code, client, user) {
    code.client = {
      id: client.id
    };
    code.uesr = {
      id: user.id
    };

    const data = { ...code };

    await this.redisClient.hmset(fmt(formats.code, code.authorizationCode), code);

    return data;
  }

  async getAuthorizationCode(authorizationCode) {
    const code = await this.redisClient.hgetall(fmt(formats.code, authorizationCode));

    if (!code || code.code !== authorizationCode) {
      return;
    }

    debug('getAuthorizationCode: sent authorization code successfully');

    return {
      ...code
    };
  }

  async getAccessToken(bearerToken) {
    const token = await this.redisClient.hgetall(fmt(formats.token, bearerToken));

    if (!token || token.accessToken !== bearerToken) {
      return;
    }

    debug('getAccessToken: sent access token successfully');

    return {
      ...token
    };
  }

  async getClient(clientId, clientSecret) {
    const client = await this.redisClient.hgetall(fmt(formats.client, clientId));

    if (!client || client.clientSecret !== clientSecret) {
      return;
    }

    debug('Sent client details successfully');

    return {
      ...client,
      grants: ['authorization_code', 'refresh_token']
    };
  }

  async getRefreshToken(bearerToken) {
    const token = await this.redisClient.hgetall(fmt(formats.token, bearerToken));

    if (!token || token.accessToken !== bearerToken) {
      return;
    }

    return {
      ...token
    };
  }

  async saveToken(token, client, user) {
    const pipe = this.redisClient.pipeline();
    token.clientId = client.clientId;
    token.userId = user.id;
    const data = {
      ...token
    };
    await pipe
      .hmset(fmt(formats.token, token.accessToken), token)
      .hmset(fmt(formats.token, token.refreshToken), token)
      .exec()
      .then(() => {
        debug('saveToken: token %s saved successfully', token);
      });
    return data;
  }
}

module.exports = new OAuth2Model();
