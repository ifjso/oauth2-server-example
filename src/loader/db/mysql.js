import Sequelize from 'sequelize';
import config from '../../config';
import ddrUser from '../../ddr/DDRUser';

const db = {};

db.ddr = new Sequelize(config.ddr);
db.dayp = new Sequelize(config.dayp);
db.Sequelize = Sequelize;

db.DDRUser = ddrUser(db.ddr, Sequelize);

export default db;
