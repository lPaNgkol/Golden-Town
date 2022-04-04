module.exports = {
    HOST: "111.223.48.225",
    USER: "welinksman",
    PASSWORD: "manofwelinks",
    DB: "welinks",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };