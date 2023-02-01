module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "goldentown",
  DB: "golden_town",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};