import Sequelize from 'sequelize';
import config from '../../config';
import ddrUser from '../../user/ddrUser';

const db = {};

const sequelize = new Sequelize(config.ddr.database, config.ddr.username, config.ddr.password, config.ddr);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.DDRUser = ddrUser(sequelize, Sequelize);

export default db;
