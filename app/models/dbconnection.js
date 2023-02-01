const config = require("../config/db.config.js");
const mysql = require('mysql');

const db = mysql.createConnection({
  user: config.USER,
  host: config.HOST,
  database: config.DB,
  password: config.PASSWORD,
  port: 3306,
});

module.exports = db;