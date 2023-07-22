// initialize variables
require('dotenv').config();
const Sequelize = require('sequelize');
let sequelize;

// connect to jaws db
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} 
// connect to localhost
else {
  sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}

// exports the connection
module.exports = sequelize;