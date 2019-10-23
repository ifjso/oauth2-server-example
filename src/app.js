import express from 'express';
import http from 'http';
import Debug from 'debug';
import config from './config';
import loaders from './loaders';

const debug = Debug('app');

// const startServer = () => {
const app = express();

loaders({ app });

const port = config.port || 3000;
app.set('port', port);

const server = http.createServer(app);

const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const listeningHandler = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
};

server.listen(port);
server.on('error', errorHandler);
server.on('listening', listeningHandler);
// };

// startServer();
