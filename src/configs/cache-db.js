import Redis from 'ioredis';
import config from './env';

const redis = new Redis({ ...config.redis });

export default redis;
