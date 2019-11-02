import { format as fmt } from 'util';
import config from 'config';
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
    const condition = { clientId };

    if (!_lang.isEmpty(clientSecret)) {
      Object.assign(condition, { clientSecret });
    }

    const client = await OAuthApp.findOne({ where: condition });

    if (_lang.isEmpty(client)) {
      return;
    }

    log.info('Client is found: %s', client.id);

    return OAuthApp.convert(client);
  }

  saveToken = async (token, client, user) => {
    const pipe = CacheDB.pipeline();

    const tokenToSave = OAuthToken.convertToSave({
      ...token,
      clientId: client.id,
      userId: user.id
    });

    await pipe
      .hmset(fmt(keyFormats.token, token.accessToken), tokenToSave)
      .expire(fmt(keyFormats.token, token.accessToken), config.get('oauth.accessTokenLifetime'))
      .hmset(fmt(keyFormats.token, token.refreshToken), tokenToSave)
      .expire(fmt(keyFormats.token, token.refreshToken), config.get('oauth.refreshTokenLifetime'))
      .exec();

    await OAuthToken.create(tokenToSave);

    log.info('Token has been saved:%s, %s', token.accessToken, token.refreshToken);

    return OAuthToken.convert(tokenToSave);
  }

  saveAuthorizationCode = async (code, client, user) => {
    const pipe = CacheDB.pipeline();

    const codeToSave = AuthorizationCode.convertToSave({ code, client, user });

    await pipe
      .hmset(fmt(keyFormats.code, code.authorizationCode), codeToSave)
      .expire(fmt(keyFormats.code, code.authorizationCode), config.get('oauth.authorizationCodeLifetime'))
      .exec();

    await AuthorizationCode.create(codeToSave);

    log.info('Authorization code has been saved: %s', code.authorizationCode);

    return AuthorizationCode.convert(codeToSave);
  }

  revokeToken = async (token) => {
    await CacheDB.del(fmt(keyFormats.token, token.refreshToken));

    await OAuthToken.destroy({ where: { refreshToken: token.refreshToken } });

    log.info('Token has been revoked: %s', token.refreshToken);

    return true;
  }

  revokeAuthorizationCode = async (code) => {
    await CacheDB.del(fmt(keyFormats.code, code.authorizationCode));

    await AuthorizationCode.destroy({ where: { code: code.authorizationCode } });

    log.info('Authorization code has been revoked: %s', code.authorizationCode);

    return true;
  }
}

export default OAuth;
