import dotenv from 'dotenv-flow';

dotenv.config();

export default {
  port: parseInt(process.env.PORT, 10),

  api: {
    prefix: process.env.BASE_PATH
  },

  log: {
    path: process.env.LOG_PATH
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
};
