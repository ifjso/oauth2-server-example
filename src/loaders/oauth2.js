const OAuth2Server = require('oauth2-server');

const { Request } = OAuth2Server;
const { Response } = OAuth2Server;

class OAuth2 {
  constructor(model) {
    this.oauth = new OAuth2Server({ model });
  }

  async authenticateHandler() {
    return this.oauth;
  }
}

module.exports = OAuth2;
