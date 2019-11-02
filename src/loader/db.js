import Sequelize from 'sequelize';
import config from 'config';

const db = {};

db.microdust = new Sequelize(config.get('mysql.microdust'));
db.Sequelize = Sequelize;

export default db;
