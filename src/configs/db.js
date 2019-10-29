import Sequelize from 'sequelize';
import config from './env';

const db = {};

db.ddr = new Sequelize(config.ddr);
db.dayp = new Sequelize(config.dayp);
db.Sequelize = Sequelize;

export default db;
