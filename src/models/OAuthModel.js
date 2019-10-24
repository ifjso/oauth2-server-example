import Redis from 'ioredis';
import { format as fmt } from 'util';
import omit from 'lodash/omit';
import debug from 'debug';
import config from '../config';

const log = debug('OAuthModel:log');

const keyFormats = {
  client: 'clients:%s',
  token: 'tokens:%s',
  user: 'users:%s',
  code: 'codes:%s'
};

class OAuthModel {
  constructor() {
    this.redisClient = new Redis({ ...config.redis });
  }

  getAccessToken = async (accessToken) => {
    // TODO cache mysql
    const token = await this.redisClient.hgetall(fmt(keyFormats.token, accessToken));

    if (!token || token.accessToken !== accessToken) {
      return;
    }

    log('Access token is found: %s', token.accessToken);

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
      client: { id: token.clientId },
      user: { id: token.userId }
    };
  }

  getRefreshToken = async (refreshToken) => {
    // TODO cache mysql
    const token = await this.redisClient.hgetall(fmt(keyFormats.token, refreshToken));

    if (!token || token.refreshToken !== refreshToken) {
      return;
    }

    log('Refresh token is found: %s', token.refreshToken);

    return {
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
      client: { id: token.clientId },
      user: { id: token.userId }
    };
  }

  getAuthorizationCode = async (authorizationCode) => {
    const code = await this.redisClient.hgetall(fmt(keyFormats.code, authorizationCode));

    if (!code || code.authorizationCode !== authorizationCode) {
      return;
    }

    log('Authorization code is found: %s', code.authorizationCode);

    return {
      ...omit(code, ['scope', 'clientId', 'userId']),
      expiresAt: new Date(code.expiresAt),
      client: { id: code.clientId },
      user: { id: code.userId }
    };
  }

  getClient = async (clientId, clientSecret) => {
    // TODO mysql, delete redis
    // TODO clientSecret가 null이 아니면 검색 조건 쿼리에 포함되어야 함
    const client = await this.redisClient.hgetall(fmt(keyFormats.client, clientId));

    if (!client) {
      return;
    }

    log('Client is found: %s', client.id);

    return {
      ...omit(client, 'secret'),
      redirectUris: client.redirectUris.split(','),
      grants: client.grants.split(','),
      accessTokenLifetime: Number(client.accessTokenLifetime),
      refreshTokenLifetime: Number(client.refreshTokenLifetime)
    };
  }

  saveToken = async (token, client, user) => {
    const pipe = this.redisClient.pipeline();

    const tokenToSave = {
      ...token,
      clientId: client.id,
      userId: user.id
    };

    // TODO redis expire
    await pipe
      .hmset(fmt(keyFormats.token, token.accessToken), tokenToSave)
      .hmset(fmt(keyFormats.token, token.refreshToken), tokenToSave)
      .exec();

    // TODO save mysql
    log('Token has been saved:%s, %s', token.accessToken, token.refreshToken);

    return {
      ...omit(token, ['authorizationCode', 'scope']),
      client: { id: client.id },
      user: { id: user.id }
    };
  }

  saveAuthorizationCode = async (code, client, user) => {
    const codeToSave = {
      ...code,
      clientId: client.id,
      userId: user.id
    };

    // TODO redis expire
    await this.redisClient.hmset(fmt(keyFormats.code, code.authorizationCode), codeToSave);

    // TODO save mysql

    log('Authorization code has been saved: %s', code.authorizationCode);

    return {
      ...omit(code, 'scope'),
      client: { id: client.id },
      user: { id: user.id }
    };
  }

  revokeToken = async (token) => {
    const result = await this.redisClient.del(fmt(keyFormats.token, token.refreshToken));

    // TODO delete mysql

    log('Token has been revoked: %s', token.refreshToken);

    return result !== 0;
  }

  revokeAuthorizationCode = async (code) => {
    const result = await this.redisClient.del(fmt(keyFormats.code, code.authorizationCode));

    log('Authorization code has been revoked: %s', code.authorizationCode);

    return result !== 0;
  }
}

export default OAuthModel;
