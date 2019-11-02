import Redis from 'ioredis';
import config from 'config';

const redis = new Redis({ ...config.get('redis') });

export default redis;
