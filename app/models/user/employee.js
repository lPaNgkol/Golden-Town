const db = require("../dbconnection");
var crypto = require('crypto');
var format = require('pg-format');

checkDuplicateUsername = (req, res, next) => {
  // Username
  const query = "SELECT * FROM users WHERE username=$1 AND active=$2 ORDER BY user_id DESC"
  const dataquery = [req.body.username, "T"];
  db.query(query, dataquery).then((results) => {
    if(results.rows.length>0){
        var ret = {"code":400,"description":"Username already in use"}
        res.status(400).json(ret)
    }else{
      next();
    }
  }).catch(error => {
    res.status(500).send({
      message: error.message
    });
  });
};

checkDuplicateEmployeeId = (req, res, next) => {
  // Username
  const query = "SELECT * FROM users WHERE employee_id=$1 AND active=$2 ORDER BY user_id DESC"
  const dataquery = [req.body.employee_id, "T"];
  db.query(query, dataquery).then((results) => {
    console.log("dupemployee")
    console.log(results.rows)
    if(results.rows.length>0){
        var ret = {"code":400,"description":"Employee_Id already in use"}
        res.status(400).json(ret)
    }else{
      next();
    }
  }).catch(error => {
    res.status(500).send({
      message: error.message
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    const query = "SELECT role_id FROM role WHERE active=$1"
    const dataquery = ["T"];
    db.query(query, dataquery).then((results) => {
      if(results.rows.length>0){
        let findError = false;
        for (var i = 0; i < results.rows.length; i++) {
          console.log(results.rows[i].role_id);
          console.log(req.body.roles);
          var indexOfRole = req.body.roles.indexOf(results.rows[i].role_id)
          console.log(indexOfRole);
          if(indexOfRole<0){
            res.status(400).send({
              message: "Failed! Role does not exist"
            });
            findError = true
            break
          }
        }
        if(!findError){
          next()
        }
      }else{
        res.status(500).send({
          message: "Internal error"
        });
      }
    }).catch(error => {
      res.status(500).send({
        message: error.message
      });
    });
    
  }
};

function createAccount(req, res){
  var date = new Date().toISOString().slice(0, 19);
  aDatetime = String(date).split("T")
  var dateNow = aDatetime[0] + " " + aDatetime[1]
  const username = req.body.username
  const password = crypto.createHash('md5').update(req.body.password).digest("hex")
  const employee_id = req.body.employee_id
  const firstname = req.body.firstname
  const lastname = req.body.lastname
  const nickname = req.body.nickname
  const gender = req.body.gender=="ชาย" ? "M" : "F"
  const dob = req.body.dob
  const job_start_date = req.body.job_start_date
  const working_status = req.body.working_status
  const position_id = req.body.position_id
  const mobileno = req.body.mobileno
  const company_id = req.body.company_id
  const work_start_time = req.body.work_start_time
  const work_end_time = req.body.work_end_time
  const work_hours = req.body.work_hours
  const imageurl = req.body.imageurl
  const active = "T"
  const createby = req.body.createby
  const createdate = dateNow
  const updateby = req.body.updateby
  const updatedate = dateNow
  return new Promise(function(resolve){
    const query = `INSERT INTO users(username, password, employee_id, firstname, lastname, nickname,
                                    gender, dob, job_start_date, working_status, position_id, mobileno, company_id, work_start_time,
                                    work_end_time, work_hours, imageurl, active, createby, createdate, updateby, updatedate) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)  RETURNING user_id;`
    const dataquery = [username, 
                       password, 
                       employee_id, 
                       firstname, 
                       lastname, 
                       nickname, 
                       gender, 
                       dob, 
                       job_start_date, 
                       working_status, 
                       position_id, 
                       mobileno, 
                       company_id,
                       work_start_time,
                       work_end_time,
                       work_hours,
                       imageurl,
                       active,
                       createby,
                       createdate,
                       updateby,
                       updatedate];
    db.query(query, dataquery).then((results) => {
      const user_id = results.rows[0].user_id
      console.log(results)
      let insertValue = []
      for (var i = 0; i < req.body.roles.length; i++) {
        insertValue.push([user_id, req.body.roles[i], createby, createdate, updateby, updatedate, "T"])
      }
      let queryRole = format("INSERT INTO user_role(user_id, role_id, createby, createdate, updateby, updatedate, active) VALUES %L", insertValue);
      db.query(queryRole).then(() => {
        resolve(user_id)
      })
      .catch(error => {
        res.status(500).send({
          message: error.message
        });
      });
    })
    .catch(error => {
      res.status(500).send({
        message: error.message
      });
    });
  })
}

function listEmployee(req, res){
  return new Promise(function(resolve){
    let query = `SELECT username, employee_id, user_id, firstname, lastname, nickname, gender,
                      dob, job_start_date, working_status, a.position_id, mobileno, a.company_id, work_start_time,
                      work_end_time, work_hours, imageurl, b.position_name, c.company_name, count(a.*) OVER() AS total_row
                  FROM users a
                  INNER JOIN positions b on a.position_id=b.position_id
                  INNER JOIN company c on c.company_id=a.company_id
                  WHERE a.active=$1 AND c.company_id=$2`
    let dataquery = ["T", req.body.company_id];
    if(req.body.limit){
      query = query + " LIMIT $3"
      dataquery.push(req.body.limit)
    }
    if(req.body.offset){
      query = query + " OFFSET $4"
      dataquery.push(req.body.offset)
    }

    console.log(query)
    console.log(dataquery)
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

function getEmployee(req, res){
  return new Promise(function(resolve){
    var date = new Date().toISOString().slice(0, 19);
    aDatetime = String(date).split("T")
    var dateNow = aDatetime[0] + " 00:00:00"
    let query = `SELECT username, employee_id, a.user_id, firstname, lastname, nickname, gender
                        dob, job_start_date, working_status, a.position_id, mobileno, a.company_id, work_start_time,
                        work_end_time, work_hours, a.imageurl as profile_url, b.position_name, c.company_name, count(a.*) OVER() AS total_row
                    FROM users a
                    INNER JOIN positions b on a.position_id=b.position_id
                    INNER JOIN company c on c.company_id=a.company_id
                    WHERE a.active=$1 AND user_id=$2`
    let dataquery = ["T", req.params.user_id];
    db.query(query, dataquery).then((results) => {
      let returnData = results.rows[0]
      let queryAttendance = `SELECT checkin_date, checkout_date
                              FROM attendance
                              WHERE active=$1 AND user_id=$2`
      let attendanceDataQuery = ["T", req.params.user_id];
      db.query(queryAttendance, attendanceDataQuery).then((results) => {
        if(results.rows.length>0){
          returnData['checkin_date'] = results.rows[0]['checkin_date']==undefined ? '' : results.rows[0]['checkin_date']
          returnData['checkout_date'] = results.rows[0]['checkout_date']==undefined ? '' : results.rows[0]['checkout_date']
        }else{
          returnData['checkin_date'] = ''
          returnData['checkout_date'] = ''
        }
        resolve(returnData)
      })
      .catch(error => {
        res.status(500).send({
          message: error.message
        });
      });
    })
    .catch(error => {
      res.status(500).send({
        message: error.message
      });
    });
  })
}

function updateEmployee(req, res){
  var date = new Date().toISOString().slice(0, 19);
  aDatetime = String(date).split("T")
  var dateNow = aDatetime[0] + " " + aDatetime[1]
  const firstname = req.body.firstname
  const lastname = req.body.lastname
  const nickname = req.body.nickname
  const gender = req.body.gender=="ชาย" ? "M" : "F"
  const dob = req.body.dob
  const job_start_date = req.body.job_start_date
  const working_status = req.body.working_status
  const position_id = req.body.position_id
  const mobileno = req.body.mobileno
  const company_id = req.body.company_id
  const work_start_time = req.body.work_start_time
  const work_end_time = req.body.work_end_time
  const work_hours = req.body.work_hours
  const imageurl = req.body.imageurl
  const active = req.body.active
  const updateby = req.body.updateby
  const updatedate = dateNow
  const employee_id = req.body.employee_id
  const user_id = req.params.user_id
  
  return new Promise(function(resolve){
    const query = `UPDATE users
                   SET firstname=$1, 
                       lastname=$2, 
                       nickname=$3 ,
                       gender=$4, 
                       dob=$5, 
                       job_start_date=$6, 
                       working_status=$7, 
                       position_id=$8, 
                       mobileno=$9, 
                       company_id=$10, 
                       work_start_time=$11,
                       work_end_time=$12, 
                       work_hours=$13, 
                       imageurl=$14, 
                       active=$15, 
                       updateby=$16, 
                       updatedate=$17,
                       employee_id=$18
                   WHERE user_id = $19
                   RETURNING user_id;`
    const dataquery = [firstname, 
                       lastname, 
                       nickname, 
                       gender, 
                       dob, 
                       job_start_date, 
                       working_status, 
                       position_id, 
                       mobileno, 
                       company_id, 
                       work_start_time, 
                       work_end_time, 
                       work_hours,
                       imageurl,
                       active,
                       updateby,
                       updatedate,
                       employee_id,
                       user_id];
    db.query(query, dataquery).then((results) => {
      console.log(results.rows)
      resolve(results.rows[0])
    })
    .catch(error => {
      res.status(500).send({
        message: error.message
      });
    });
  })
}

const employee = {
    checkDuplicateUsername: checkDuplicateUsername,
    createAccount: createAccount,
    checkRolesExisted: checkRolesExisted,
    listEmployee: listEmployee,
    getEmployee: getEmployee,
    updateEmployee: updateEmployee,
    checkDuplicateEmployeeId: checkDuplicateEmployeeId
};
module.exports = employee;