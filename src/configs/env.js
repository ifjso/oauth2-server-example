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
  },

  ddr: {
    username: process.env.MYSQL_DDR_USERNAME,
    password: process.env.MYSQL_DDR_PASSWORD,
    database: process.env.MYSQL_DDR_DATABASE,
    host: process.env.MYSQL_DDR_HOST,
    dialect: process.env.MYSQL_DDR_DIALECT
  },

  dayp: {
    username: process.env.MYSQL_DAYP_USERNAME,
    password: process.env.MYSQL_DAYP_PASSWORD,
    database: process.env.MYSQL_DAYP_DATABASE,
    host: process.env.MYSQL_DAYP_HOST,
    dialect: process.env.MYSQL_DAYP_DIALECT
  }
};
