const db = require("../dbconnection");

function userLogin(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT user_id, username, password, firstname, lastname, gender, email FROM tbl_user WHERE username = ?`
    let dataquery = [req.body.username];
    // console.log(dataquery);

    db.connect(function () {
      console.log("Connected!");
      db.query(query, dataquery, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });
  });
};

function userEmail(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT * FROM tbl_user WHERE email = ?`
    let dataquery = [req.body.email];
    // console.log(dataquery);

    db.connect(function () {
      console.log("Connected!");
      db.query(query, dataquery, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });
  });
};

function userOTP(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT * FROM tbl_user WHERE number_random = ?`
    let dataquery = [req.body.number_random];
    // console.log(dataquery);

    db.connect(function () {
      console.log("Connected!");
      db.query(query, dataquery, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });
  });
};

function userList(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT * FROM tbl_user`
    let dataquery = [];
    // console.log(dataquery);

    db.connect(function () {
      console.log("Connected!");
      db.query(query, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });
  });
};

function userListUserId(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT * FROM tbl_user WHERE user_id = ?`
    let dataquery = [req.params.user_id];
    // console.log(dataquery);

    db.connect(function () {
      console.log("Connected!");
      db.query(query, dataquery, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });
  });
};

function userCreate(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const gender = req.body.gender;
  const address = req.body.address;
  const tel = req.body.tel;
  const email = req.body.email;
  const number_random = req.body.number_random;
  return new Promise(function (resolve) {
    let query = `INSERT INTO tbl_user(username, password, firstname, lastname, gender, address, tel, email, number_random) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let dataquery = [username, password, firstname, lastname, gender, address, tel, email, number_random];
    // console.log(dataquery);

    db.connect(function () {
      console.log("Connected!");
      db.query(query, dataquery, function (err, result) {
        if (err) throw err;
        resolve(result.insertId);
      });
    });
  });
};

function userUpdate(req, res) {
  const user_id = req.params.user_id;
  const dob = req.body.dob;
  const tel = req.body.tel;
  return new Promise(function (resolve) {
    let query = `UPDATE tbl_user SET
                dob = ?, 
                tel = ?
                WHERE user_id = ?`
    let dataquery = [dob, tel, user_id];
    // console.log(dataquery);

    db.connect(function () {
      console.log("Connected!");
      db.query(query, dataquery, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });
  });
};

function userUpdatePassword(req, res) {
  const user_id = req.params.user_id;
  const password = req.body.password;
  const number_random = req.body.number_random;
  return new Promise(function (resolve) {
    let query = `UPDATE tbl_user SET 
                password = ?,
                number_random = ?
                WHERE user_id = ?`
    let dataquery = [password, number_random, user_id];
    // console.log(dataquery);

    db.connect(function () {
      console.log("Connected!");
      db.query(query, dataquery, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    });
  });
};

checkDuplicateUsername = (req, res, next) => {
  let query = `SELECT * FROM tbl_user WHERE username = ?`
  let dataquery = [req.body.username];
  // console.log(dataquery);

  db.connect(function () {
    console.log("Connected!");
    db.query(query, dataquery, function (err, result) {
      if (result.length > 0) {
        var ret = {
          "code": "USER404",
          "description": "Username already used."
        }
        res.status(200).json(ret)
      } else {
        next();
      }
    });
  });
};

checkDuplicateEmail = (req, res, next) => {
  let query = `SELECT * FROM tbl_user WHERE email = ?`
  let dataquery = [req.body.email];
  // console.log(dataquery);

  db.connect(function () {
    console.log("Connected!");
    db.query(query, dataquery, function (err, result) {
      if (result.length > 0) {
        var ret = {
          "code": "USER404",
          "description": "Email already used."
        }
        res.status(200).json(ret)
      } else {
        next();
      }
    });
  });
};

checkUserExist = (req, res, next) => {
  let query = `SELECT * FROM tbl_user WHERE user_id = ?`
  let dataquery = [req.params.user_id];
  // console.log(dataquery);

  db.connect(function () {
    console.log("Connected!");
    db.query(query, dataquery, function (err, result) {
      if (result.length <= 0) {
        var ret = {
          "code": "USER404",
          "description": "User Not found."
        }
        res.status(200).json(ret)
      } else {
        next();
      }
    });
  });
};

const user = {
  userLogin: userLogin,
  userEmail: userEmail,
  userOTP: userOTP,
  userList: userList,
  userListUserId: userListUserId,
  userCreate: userCreate,
  userUpdate: userUpdate,
  userUpdatePassword: userUpdatePassword,
  checkDuplicateUsername: checkDuplicateUsername,
  checkDuplicateEmail: checkDuplicateEmail,
  checkUserExist: checkUserExist,
};
module.exports = user;