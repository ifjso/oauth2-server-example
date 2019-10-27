import Sequelize from 'sequelize';
import config from '../../config';

const db = {};

const sequelize = new Sequelize(config.ddr.database, config.ddr.username, config.ddr.password, config.ddr);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
