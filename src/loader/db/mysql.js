import Sequelize from 'sequelize';
import config from '../../config';
import ddrUser from '../../ddr/DDRUser';
import daylipassUser from '../../daylipass/DaylipassUser';

const db = {};

db.ddr = new Sequelize(config.ddr);
db.dayp = new Sequelize(config.dayp);
db.Sequelize = Sequelize;

db.DDRUser = ddrUser(db.ddr, Sequelize);
db.DaylipassUser = daylipassUser(db.dayp, Sequelize);


db.DaylipassUser.findAll({})
  .then((data) => console.log(data));

export default db;
