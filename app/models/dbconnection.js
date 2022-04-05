const config = require("../config/db.config.js");
const Pool = require('pg').Pool
const db = new Pool({
  user: config.USER,
  host: config.HOST,
  database: config.DB,
  password: config.PASSWORD,
  port: 5432,
})
module.exports = db;