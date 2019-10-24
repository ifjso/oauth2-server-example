import Redis from 'ioredis';
import { format as fmt } from 'util';
import Debug from 'debug';

const debug = Debug('OAuthModel');

const keyFormats = {
  client: 'clients:%s',
  token: 'tokens:%s',
  user: 'users:%s',
  code: 'codes:%s'
};

class OAuthModel {
  constructor() {
    this.redisClient = new Redis();
  }

  getAccessToken = async (accessToken) => {
    debug('getAccessToken');

    // TODO cache mysql
    const token = await this.redisClient.hgetall(fmt(keyFormats.token, accessToken));

    if (!token || token.accessToken !== accessToken) {
      return;
    }

    debug('getAccessToken: sent access token successfully');

    return {
      ...token
    };
  }

  getRefreshToken = async (refreshToken) => {
    debug('getRefreshToken');

    // TODO cache mysql
    const token = await this.redisClient.hgetall(fmt(keyFormats.token, refreshToken));

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

  getAuthorizationCode = async (authorizationCode) => {
    debug('getAuthorizationCode');

    const code = await this.redisClient.hgetall(fmt(keyFormats.code, authorizationCode));

    debug(code);

    if (!code) {
      return;
    }

    debug('getAuthorizationCode: sent authorization code successfully');

    return {
      ...code,
      expiresAt: new Date(code.expiresAt),
      client: { id: code.clientId },
      user: { id: code.userId }
    };
  }

  getClient = async (clientId, clientSecret) => {
    debug('getClient %s %s', clientId, clientSecret);

    // TODO mysql, delete redis
    // TODO clientSecret가 null이 아니면 검색 조건 쿼리에 포함되어야 함
    const client = await this.redisClient.hgetall(fmt(keyFormats.client, clientId));

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

  saveToken = async (token, client, user) => {
    debug('saveToken');

    debug(token);
    debug(client);
    debug(user);
    const pipe = this.redisClient.pipeline();

    const clonedToken = {
      ...token,
      clientId: client.id,
      userId: user.id
    };

    debug(clonedToken);

    debug(token);

    // TODO redis expire
    await pipe
      .hmset(fmt(keyFormats.token, token.accessToken), clonedToken)
      .hmset(fmt(keyFormats.token, token.refreshToken), clonedToken)
      .exec()
      .then(() => {
        debug('saveToken: token %s saved successfully', clonedToken);
      });

    // TODO save mysql

    return {
      ...clonedToken,
      client: { id: client.clientId },
      user: { id: user.id }
    };
  }

  saveAuthorizationCode = async (code, client, user) => {
    debug('saveAuthorizationCode');

    debug(code);

    const clonedCode = {
      ...code,
      clientId: client.id,
      userId: user.id
    };

    // TODO redis expire
    await this.redisClient.hmset(fmt(keyFormats.code, code.authorizationCode), clonedCode);

    // TODO save mysql

    return {
      ...clonedCode
    };
  }

  revokeToken = async (token) => {
    debug('revokeToken');

    const result = await this.redisClient.del(fmt(keyFormats.token, token.refreshToken));

    // TODO delete mysql

    return result !== 0;
  }

  revokeAuthorizationCode = async (code) => {
    debug('revokeAuthorizationCode');

    const result = await this.redisClient.del(fmt(keyFormats.code, code.authorizationCode));
    return result !== 0;
  }

  verifyScope = (accessToken, scope) => {
    debug('verifyScope');
    return true;
  }
}

export default OAuthModel;
