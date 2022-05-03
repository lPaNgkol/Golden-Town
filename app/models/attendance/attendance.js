const db = require("../dbconnection");
var moment = require('moment');

function checkHasCheckin (req, res){
    return new Promise(function(resolve){
        var time = moment();
        var date = time.format('YYYY-MM-DDTHH:mm:ss');
        aDatetime = String(date).split("T")
        var dateNow = aDatetime[0] + " 00:00:00"
        const query = "SELECT * FROM attendance WHERE user_id=$1 AND active=$2 AND checkin_date>=$3 ORDER BY attendance_id DESC"
        const dataquery = [req.params.user_id, "T", dateNow];
        db.query(query, dataquery).then((results) => {
            if(results.rows.length>0){
                var ret = {"code":"WEAT004","description":"Already Checkin Today"}
                res.status(200).json(ret)
            }else{
                resolve(true)
            }
            }).catch(error => {
            res.status(500).send({
                message: error.message
            });
        });
    })
};

function checkCanCheckOut(req, res){
    return new Promise(function(resolve){
        var time = moment();
        var date = time.format('YYYY-MM-DDTHH:mm:ss');
        aDatetime = String(date).split("T")
        var dateNow = aDatetime[0] + " 00:00:00"
        const query = "SELECT * FROM attendance WHERE user_id=$1 AND active=$2 AND checkin_date>=$3 ORDER BY attendance_id DESC"
        const dataquery = [req.params.user_id, "T", dateNow];
        db.query(query, dataquery).then((results) => {
            console.log(results.rows)
            if(results.rows.length==0){
                var ret = {"code":"WEAT005","description":"Checkin Not Found"}
                res.status(200).json(ret)
            }else{
                resolve(true)
            }
            }).catch(error => {
                res.status(500).send({
                    message: error.message
            });
        });
    })
};

function checkHasCheckout(req, res){
    return new Promise(function(resolve){
        var time = moment();
        var date = time.format('YYYY-MM-DDTHH:mm:ss');
        aDatetime = String(date).split("T")
        var dateNow = aDatetime[0] + " 00:00:00"
        const query = "SELECT * FROM attendance WHERE user_id=$1 AND active=$2 AND checkout_date>=$3 ORDER BY attendance_id DESC"
        const dataquery = [req.params.user_id, "T", dateNow];
        db.query(query, dataquery).then((results) => {
            if(results.rows.length>0){
                var ret = {"code":"WEAT006","description":"Already Checkout Today"}
                res.status(200).json(ret)
            }else{
                resolve(true)
            }
            }).catch(error => {
                res.status(500).send({
                    message: error.message
            });
        });
    })
};

function attendanceList(req, res){
    return new Promise(function(resolve){
      let query = `SELECT *, count(*) OVER() AS total_row FROM attendance WHERE active=$1`
      let dataquery = ["T"];
      if(req.body.limit){
        query = query + " LIMIT $2"
        dataquery.push(req.body.limit)
      }
      if(req.body.offset){
        query = query + " OFFSET $3"
        dataquery.push(req.body.offset)
      }
      db.query(query, dataquery).then((results) => {
        resolve(results.rows)
      })
      .catch(error => {
        res.status(500).send({
          message: error.message
        });
      });
    })
  }

function checkin(req, res){
    var time = moment();
    var date = time.format('YYYY-MM-DDTHH:mm:ss');
    aDatetime = String(date).split("T")
    var checkin_date = aDatetime[0] + " " + aDatetime[1]
    console.log(checkin_date)
    const user_id = req.params.user_id
    const checkin_location = req.body.checkin_location
    const active = "T"
    const workplace = req.body.workplace
    const createdate = checkin_date
    const createby = req.body.updateby
    const updateby = req.body.updateby
    const updatedate = checkin_date
    return new Promise(function(resolve){
      const query = `INSERT INTO attendance(user_id, checkin_date, checkin_location, workplace, active, createby, createdate, updateby, updatedate) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)  RETURNING attendance_id;`
      const dataquery = [user_id, 
                         checkin_date,
                         checkin_location,
                         workplace,
                         active,
                         createby,
                         createdate,
                         updateby,
                         updatedate];
      db.query(query, dataquery).then((results) => {
        if(results.rows[0]!==undefined){
            results.rows[0]["checkin_date"] = checkin_date
        }
        resolve(results.rows)
      })
      .catch(error => {
        res.status(500).send({
          message: error.message
        });
      });
    })
}

function checkout(req, res){
    var time = moment();
    var date = time.format('YYYY-MM-DDTHH:mm:ss');
    aDatetime = String(date).split("T")
    var checkout_date = aDatetime[0] + " " + aDatetime[1]
    const user_id = req.params.user_id
    const checkout_location = req.body.checkout_location
    const updateby = req.body.updateby
    const updatedate = checkout_date
    const feeling_today = req.body.feeling_today

    var today = time.format('YYYY-MM-DD') + " 00:00:00";
    return new Promise(function(resolve){
      const query = `UPDATE attendance SET
                        checkout_date=$1,
                        checkout_location=$2,
                        updateby=$3,
                        updatedate=$4,
                        feeling_today=$6
                    WHERE user_id = $5 AND checkin_date>=$7
                    RETURNING attendance_id;
                    `
      const dataquery = [checkout_date, 
                         checkout_location,
                         updateby,
                         updatedate,
                         user_id,
                         feeling_today,
                         today];
      db.query(query, dataquery).then((results) => {
        console.log(results.rows)
        if(results.rows[0]!==undefined){
            results.rows[0]["checkout_date"] = checkout_date
        }
        resolve(results.rows)
      })
      .catch(error => {
        res.status(500).send({
          message: error.message
        });
      });
    })
}

const attendance = {
    attendanceList: attendanceList,
    checkHasCheckin: checkHasCheckin,
    checkin:checkin,
    checkout:checkout,
    checkCanCheckOut:checkCanCheckOut,
    checkHasCheckout:checkHasCheckout
};
module.exports = attendance;