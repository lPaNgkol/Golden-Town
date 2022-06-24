const db = require("../dbconnection");
var moment = require('moment');

function checkHasCheckin (req, res){
    return new Promise(function(resolve){
        var time = moment();
        var date = time.format('YYYY-MM-DDTHH:mm:ss');
        aDatetime = String(date).split("T")
        var timeNow = aDatetime[1].split(":")
        //กรณีจะเชคอินหลังเที่ยงคืน ห้ามเช็คอินต้องรอหลังตีห้า
        if(timeNow[0]- -0 <5){
          var ret = {"code":"WEAT007","description":"Not in Checkin Period!"}
          res.status(200).json(ret)
        }else{
          var dateNow = aDatetime[0] + " 05:00:00"
          const query = "SELECT * FROM attendance WHERE user_id=$1 AND active=$2 AND checkin_date>=$3 ORDER BY attendance_id DESC"
          const dataquery = [req.params.user_id, "T", dateNow];
          db.query(query, dataquery).then((results) => {
              if(results.rows.length>0){
                console.log(results.rows);
                  var ret = {"code":"WEAT004","description":"Already Checkin Today"}
                  res.status(200).json(ret)
              }else{
                  resolve(true)
              }
              }).catch(error => {
              res.status(500).send({
                  code:"WEAT500",
                  description: error.message
              });
          });

        }
    })
};

function checkCanCheckOut(req, res){
    return new Promise(function(resolve){
        var time = moment();
        var date = time.format('YYYY-MM-DDTHH:mm:ss');
        aDatetime = String(date).split("T")
        var timeNow = aDatetime[1].split(":")
        var dateNow = aDatetime[0] + " 05:00:00"
        //กรณีจะเชคเอ้าหลังเที่ยงคืนเช็คว่ามีเช็คอินหลังตีห้าเมื่อวานไหม
        var query = ""
        var dataquery = []
        if(timeNow[0]- -0 >=5){
          query = "SELECT * FROM attendance WHERE user_id=$1 AND active=$2 AND checkin_date>=$3 ORDER BY attendance_id DESC"
          dataquery = [req.params.user_id, "T", dateNow];
        }else{
          let yesterday  = moment().add(-1,'days');
          var dateYesterday = yesterday.format('YYYY-MM-DDTHH:mm:ss');
          var aDatetimeYesterday = String(dateYesterday).split("T")
          var dateAttendanceYesterday = aDatetimeYesterday[0] + " 05:00:00"

          query = "SELECT * FROM attendance WHERE user_id=$1 AND active=$2 AND checkin_date>=$3 ORDER BY attendance_id DESC"
          dataquery = [req.params.user_id, "T", dateAttendanceYesterday];
        }
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
                  code:"WEAT500",
                  description: error.message
            });
        });
    })
};

function checkHasCheckout(req, res){
    return new Promise(function(resolve){
        var time = moment();
        var date = time.format('YYYY-MM-DDTHH:mm:ss');
        aDatetime = String(date).split("T")
        var timeNow = aDatetime[1].split(":")
        var dateNow = aDatetime[0] + " 05:00:00"
        //กรณีจะเชคเอ้าหลังเที่ยงคืนเช็คว่ามีเช็คเอ้าหลังตีห้าเมื่อวานไหม
        var query = ""
        var dataquery = []
        if(timeNow[0]- -0 >=5){
          query = "SELECT * FROM attendance WHERE user_id=$1 AND active=$2 AND checkout_date>=$3 ORDER BY attendance_id DESC"
          dataquery = [req.params.user_id, "T", dateNow];
        }else{
          let yesterday  = moment().add(-1,'days');
          var dateYesterday = yesterday.format('YYYY-MM-DDTHH:mm:ss');
          var aDatetimeYesterday = String(dateYesterday).split("T")
          var dateAttendanceYesterday = aDatetimeYesterday[0] + " 05:00:00"

          query = "SELECT * FROM attendance WHERE user_id=$1 AND active=$2 AND checkout_date>=$3 ORDER BY attendance_id DESC"
          dataquery = [req.params.user_id, "T", dateAttendanceYesterday];
        }
        db.query(query, dataquery).then((results) => {
            if(results.rows.length>0){
                var ret = {"code":"WEAT006","description":"Already Checkout Today"}
                res.status(200).json(ret)
            }else{
                resolve(true)
            }
            }).catch(error => {
                res.status(500).send({
                  code:"WEAT500",
                  description: error.message
            });
        });
    })
};

function attendanceListByUser(req, res){
  return new Promise(function(resolve){
    let query = `SELECT a.*, b.work_start_time + interval '15 minute' as late_work_start, b.work_start_time, 
                        b.user_id, b.firstname, b.lastname, c.position_name, b.employee_id, b.image_url, b.gender 
                 FROM attendance a 
                 INNER JOIN users b on a.user_id=b.user_id
                 LEFT JOIN positions c on c.position_id=b.position_id 
                 WHERE a.active=$1`
    let dataquery = ["T"];
    if(req.params.user_id){
      query = query + " AND a.user_id=$2"
      dataquery.push(req.params.user_id)
    }
    console.log(dataquery);
    let roleArray = [];
    db.query(query, dataquery).then((results) => {
      roleArray = results.rows
      for (var i = 0; i < roleArray.length; i++) {
        if(roleArray[i]['checkin_date']==null) roleArray[i]['checkin_date'] = ''
        if(roleArray[i]['checkout_date']==null) roleArray[i]['checkout_date'] = ''
        var inTime = moment(roleArray[i]['checkin_date']);//now
        var outTime = moment(roleArray[i]['checkout_date']);

        roleArray[i]['work_duration'] = ""
        if(roleArray[i]['checkin_date']!='' && roleArray[i]['checkout_date']==''){
          var checkinTime = roleArray[i]['checkin_date']
          console.log(checkinTime);
          checkinTime = String(checkinTime).split(" ")
          if(checkinTime[1] > roleArray[i]['late_work_start']){
            workStatusDataQuery = ['notworking', req.params.user_id];
            roleArray[i]["working_status"] = "late"
          }else{
            workStatusDataQuery = ['notworking', req.params.user_id];
            roleArray[i]["working_status"] = "intime"
          }
        }else if(roleArray[i]['checkin_date']!='' && roleArray[i]['checkout_date']!=''){
          const sec = parseInt(outTime.diff(inTime, 'seconds'), 10); // convert value to number if it's string
          let hours   = Math.floor(sec / 3600); // get hours
          let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
          let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
          // add 0 if value < 10; Example: 2 => 02
          if (hours   < 10) {hours   = "0"+hours;}
          if (minutes < 10) {minutes = "0"+minutes;}
          if (seconds < 10) {seconds = "0"+seconds;}
          if(!isNaN(seconds) || !isNaN(minutes) || !isNaN(hours)) roleArray[i]['work_duration'] = hours + ":" + minutes + ":" + seconds

          workStatusDataQuery = ['offwork', req.params.user_id];
          roleArray[i]["working_status"] = "offwork"
        }else{
          workStatusDataQuery = ['notworking', req.params.user_id];
          roleArray[i]["working_status"] = "notworking"
        }
      }
      resolve(roleArray)
    })
    .catch(error => {
      res.status(500).send({
        code:"WEAT500",
        description: error.message
      });
    });
  })
}

function attendanceList(req, res){
  return new Promise(function(resolve){
    let query = `SELECT a.*, count(a.*) OVER() AS total_row, b.work_start_time + interval '15 minute' as late_work_start, 
                        b.work_start_time, b.user_id, b.firstname, b.lastname, c.position_name, b.employee_id, b.image_url, b.gender 
                 FROM attendance a 
                 INNER JOIN users b on a.user_id=b.user_id
                 LEFT JOIN positions c on c.position_id=b.position_id 
                 WHERE a.active=$1`
    let dataquery = ["T"];
    if(req.body.limit){
      query = query + " LIMIT $2"
      dataquery.push(req.body.limit)
    }
    if(req.body.offset){
      query = query + " OFFSET $3"
      dataquery.push(req.body.offset)
    }
    let roleArray = [];
    db.query(query, dataquery).then((results) => {
      roleArray = results.rows
      for (var i = 0; i < roleArray.length; i++) {
        if(roleArray[i]['checkin_date']==null) roleArray[i]['checkin_date'] = ''
        if(roleArray[i]['checkout_date']==null) roleArray[i]['checkout_date'] = ''
        var inTime = moment(roleArray[i]['checkin_date']);//now
        var outTime = moment(roleArray[i]['checkout_date']);

        roleArray[i]['work_duration'] = ""
        if(roleArray[i]['checkin_date']!='' && roleArray[i]['checkout_date']==''){
          var checkinTime = roleArray[i]['checkin_date']
          console.log(checkinTime);
          checkinTime = String(checkinTime).split(" ")
          if(checkinTime[1] > roleArray[i]['late_work_start']){
            workStatusDataQuery = ['notworking', req.params.user_id];
            roleArray[i]["working_status"] = "late"
          }else{
            workStatusDataQuery = ['notworking', req.params.user_id];
            roleArray[i]["working_status"] = "intime"
          }
        }else if(roleArray[i]['checkin_date']!='' && roleArray[i]['checkout_date']!=''){
          const sec = parseInt(outTime.diff(inTime, 'seconds'), 10); // convert value to number if it's string
          let hours   = Math.floor(sec / 3600); // get hours
          let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
          let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
          // add 0 if value < 10; Example: 2 => 02
          if (hours   < 10) {hours   = "0"+hours;}
          if (minutes < 10) {minutes = "0"+minutes;}
          if (seconds < 10) {seconds = "0"+seconds;}
          if(!isNaN(seconds) || !isNaN(minutes) || !isNaN(hours)) roleArray[i]['work_duration'] = hours + ":" + minutes + ":" + seconds

          workStatusDataQuery = ['offwork', req.params.user_id];
          roleArray[i]["working_status"] = "offwork"
        }else{
          workStatusDataQuery = ['notworking', req.params.user_id];
          roleArray[i]["working_status"] = "notworking"
        }
      }
      resolve(roleArray)
    })
    .catch(error => {
      res.status(500).send({
        code:"WEAT500",
        description: error.message
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
          code:"WEAT500",
          description: error.message
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
          code:"WEAT500",
          description: error.message
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
    checkHasCheckout:checkHasCheckout,
    attendanceListByUser:attendanceListByUser
};
module.exports = attendance;