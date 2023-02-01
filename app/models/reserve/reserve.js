const db = require("../dbconnection");

function reserveList(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT a.id, a.user_id, e.username, a.reserve_id, b.reserve_name, a.total_user, a.date, a.time_id, c.time_name, a.status_id, d.status_name 
    FROM tbl_reserve a 
    JOIN tbl_reserve_select b
    ON a.reserve_id = b.reserve_id
    JOIN tbl_time c
    ON a.time_id = c.time_id
    JOIN tbl_status d
    ON a.status_id = d.status_id
    JOIN tbl_user e
    ON a.user_id = e.user_id
    WHERE a.date = ?
    ORDER BY a.status_id ASC`
    let dataquery = [req.body.date];
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

function reserveListAdmin(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT a.id, a.user_id, a.reserve_id, b.reserve_name, a.total_user, a.date, a.time_id, c.time_name, a.status_id, d.status_name
    FROM tbl_reserve a 
    JOIN tbl_reserve_select b 
    ON a.reserve_id = b.reserve_id
    JOIN tbl_time c
    ON a.time_id = c.time_id
    JOIN tbl_status d
    ON a.status_id = d.status_id
    WHERE a.status_id = ?
    ORDER BY a.date ASC`
    let dataquery = [2];
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

function reserveListUserId(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT a.id, a.user_id, a.reserve_id, b.reserve_name, a.total_user, a.date, a.time_id, c.time_name, a.status_id, d.status_name
    FROM tbl_reserve a 
    JOIN tbl_reserve_select b 
    ON a.reserve_id = b.reserve_id
    JOIN tbl_time c
    ON a.time_id = c.time_id
    JOIN tbl_status d
    ON a.status_id = d.status_id
    WHERE a.user_id = ? && a.status_id = ?
    ORDER BY a.date ASC`
    let dataquery = [req.params.user_id, 2];
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

function reserveListReserveId(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT a.id, a.user_id, b.username, a.reserve_id, a.total_user, a.date, a.time_id, c.time_name, a.status_id, d.status_name 
    FROM tbl_reserve a 
    JOIN tbl_user b 
    ON a.user_id = b.user_id
    JOIN tbl_time c
    ON a.time_id = c.time_id
    JOIN tbl_status d
    ON a.status_id = d.status_id
    WHERE a.reserve_id = ? && a.status_id = ?
    ORDER BY a.date ASC`
    let dataquery = [req.params.reserve_id, 2];
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

function reserveCreate(req, res) {
  const user_id = req.params.user_id;
  const reserve_id = req.params.reserve_id;
  const total_user = req.body.total_user;
  const date = req.body.date;
  const time_id = req.body.time_id;
  const status_id = 2;
  return new Promise(function (resolve) {
    let query = `INSERT INTO tbl_reserve(user_id, reserve_id, total_user, date, time_id, status_id) 
    VALUES (?, ?, ?, ?, ?, ?)`;
    let dataquery = [user_id, reserve_id, total_user, date, time_id, status_id];
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

function reserveUpdate(req, res) {
  const id = req.params.id;
  const status_id = req.body.status_id;
  return new Promise(function (resolve) {
    let query = `UPDATE tbl_reserve SET 
                status_id = ?
                WHERE id = ?`
    let dataquery = [status_id, id];
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

checkDuplicateReserve = (req, res, next) => {
  let query = `SELECT * FROM tbl_reserve WHERE reserve_id = ? AND date = ? AND time_id = ? AND 	status_id = ?`
  let dataquery = [req.params.reserve_id, req.body.date, req.body.time_id, req.body.status_id];
  // console.log(dataquery);

  db.connect(function () {
    console.log("Connected!");
    db.query(query, dataquery, function (err, result) {
      if (req.body.status_id < 3) {
        if (result.length > 0) {
          var ret = {
            "code": "RESL404",
            "description": "Please, Select time again this time is full."
          }
          res.status(200).json(ret)
        } else {
          next();
        }
      } else {
        next();
      }
    });
  });
};

checkIdExist = (req, res, next) => {
  let query = `SELECT * FROM tbl_reserve WHERE id = ?`
  let dataquery = [req.params.id];
  // console.log(dataquery);

  db.connect(function () {
    console.log("Connected!");
    db.query(query, dataquery, function (err, result) {
      if (result.length <= 0) {
        var ret = {
          "code": "RESL404",
          "description": "Reserve Not found."
        }
        res.status(200).json(ret)
      } else {
        next();
      }
    });
  });
};

const reserve = {
  reserveList: reserveList,
  reserveListAdmin: reserveListAdmin,
  reserveListUserId: reserveListUserId,
  reserveListReserveId: reserveListReserveId,
  reserveCreate: reserveCreate,
  reserveUpdate: reserveUpdate,
  checkDuplicateReserve: checkDuplicateReserve,
  checkIdExist: checkIdExist,
};
module.exports = reserve;