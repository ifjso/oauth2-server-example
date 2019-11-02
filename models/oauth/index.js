import { format as fmt } from 'util';
import _omit from 'lodash/omit';
import _lang from 'lodash/lang';
import { log } from '../../loader/logger';
import CacheDB from '../../loader/cache-db';
import OAuthToken from './oauth-token';
import OAuthApp from './oauth-app';
import AuthorizationCode from './authorization-code';

const keyFormats = {
  client: 'clients:%s',
  token: 'tokens:%s',
  user: 'users:%s',
  code: 'codes:%s'
};

class OAuth {
  getAccessToken = async (accessToken) => {
    let token = await CacheDB.hgetall(fmt(keyFormats.token, accessToken));

    if (_lang.isEmpty(token)) {
      token = await OAuthToken.findOne({ where: { accessToken } });

      if (_lang.isEmpty(token)) {
        return;
      }

      CacheDB.hmset(fmt(keyFormats.token, accessToken), OAuthToken.convertToSave(token));
    }

    log.info('Access token is found: %s', accessToken);

    return OAuthToken.convertToAccessToken(token);
  }

  getRefreshToken = async (refreshToken) => {
    let token = await CacheDB.hgetall(fmt(keyFormats.token, refreshToken));

    if (_lang.isEmpty(token)) {
      token = await OAuthToken.findOne({ where: { refreshToken } });

      if (_lang.isEmpty(token)) {
        return;
      }
    }

    log.info('Refresh token is found: %s', refreshToken);

    return OAuthToken.convertToRefreshToken(token);
  }

  getAuthorizationCode = async (authorizationCode) => {
    let code = await CacheDB.hgetall(fmt(keyFormats.code, authorizationCode));

    if (_lang.isEmpty(code)) {
      code = await AuthorizationCode.findOne({ where: { code: authorizationCode } });

      if (_lang.isEmpty(code)) {
        return;
      }
    }

    log.info('Authorization code is found: %s', code.authorizationCode);

    return AuthorizationCode.convert(code);
  }

  getClient = async (clientId, clientSecret) => {
    // TODO mysql, delete redis
    // TODO clientSecret가 null이 아니면 검색 조건 쿼리에 포함되어야 함
    const client = await CacheDB.hgetall(fmt(keyFormats.client, clientId));

    if (!client) {
      return;
    }

    log.info('Client is found: %s', client.id);

    return {
      ..._omit(client, 'secret'),
      redirectUris: client.redirectUris.split(','),
      grants: client.grants.split(','),
      accessTokenLifetime: Number(client.accessTokenLifetime),
      refreshTokenLifetime: Number(client.refreshTokenLifetime)
    };
  }

  saveToken = async (token, client, user) => {
    const pipe = CacheDB.pipeline();

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
    log.info('Token has been saved:%s, %s', token.accessToken, token.refreshToken);

    return {
      ..._omit(token, ['authorizationCode', 'scope']),
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
    await CacheDB.hmset(fmt(keyFormats.code, code.authorizationCode), codeToSave);

    // TODO save mysql

    log.info('Authorization code has been saved: %s', code.authorizationCode);

    return {
      ..._omit(code, 'scope'),
      client: { id: client.id },
      user: { id: user.id }
    };
  }

  revokeToken = async (token) => {
    const result = await CacheDB.del(fmt(keyFormats.token, token.refreshToken));

    // TODO delete mysql

    log.info('Token has been revoked: %s', token.refreshToken);

    return true;
  }

  revokeAuthorizationCode = async (code) => {
    const result = await CacheDB.del(fmt(keyFormats.code, code.authorizationCode));

    log.info('Authorization code has been revoked: %s', code.authorizationCode);

    return result !== 0;
  }
}

export default OAuth;
