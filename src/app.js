import express from 'express';
import http from 'http';
import config from './config';
import loaders from './loaders';
import log from './logger';

const startServer = () => {
  const app = express();

  loaders(app);

  const port = config.port || 3000;
  app.set('port', port);

  const server = http.createServer(app);

  server.listen(port);
  server.on('error', handleError);
  server.on('listening', handleListening);

  function handleError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    switch (error.code) {
      case 'EACCES':
        log.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        log.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function handleListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    log.info(`Listening on ${bind}`);
  }
};

startServer();
