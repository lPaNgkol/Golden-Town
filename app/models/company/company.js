const db = require("../dbconnection");
var format = require('pg-format');
var moment = require('moment');

checkDuplicateCompanyName = (req, res, next) => {
  let query = ""
  let dataquery = [];
    if(req.params.company_id){
      query = "SELECT * FROM company WHERE company_name=$1 AND active=$2 AND company_id!=$3 ORDER BY company_id DESC"
      dataquery = [req.body.company_name, "T", req.params.company_id];
    }else{
      query = "SELECT * FROM company WHERE company_name=$1 AND active=$2 ORDER BY company_id DESC"
      dataquery = [req.body.company_name, "T"];
    }
    db.query(query, dataquery).then((results) => {
      if(results.rows.length>0){
          var ret = {"code":"WECO001", "description":"Company name already in use"}
          res.status(200).json(ret)
      }else{
        next();
      }
    }).catch(error => {
      res.status(500).send({
        code:"WECO500",
        description: error.message
      });
    });
  };

function companyList(req, res){
    return new Promise(function(resolve){
      let query = `SELECT a.*, count(b.*) AS total_employee 
                   FROM company a 
                   LEFT JOIN users b on b.company_id=a.company_id
                   WHERE a.active=$1
                   GROUP BY a.company_id`
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
          code:"WECO500",
          description: error.message
        });
      });
    })
  }

function createCompany(req, res){
    var time = moment();
    var date = time.format('YYYY-MM-DDTHH:mm:ss');
    aDatetime = String(date).split("T")
    var dateNow = aDatetime[0] + " " + aDatetime[1]
    const company_name = req.body.company_name
    const address = req.body.address
    const active = "T"
    const createby = req.body.createby
    const createdate = dateNow
    const updateby = req.body.updateby
    const updatedate = dateNow
    return new Promise(function(resolve){
      const query = `INSERT INTO company(company_name, address, active, createby, createdate, updateby, updatedate) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7)  RETURNING company_id;`
      const dataquery = [company_name, 
        address,
                         active,
                         createby,
                         createdate,
                         updateby,
                         updatedate];
      db.query(query, dataquery).then((results) => {
        resolve(results.rows)
      })
      .catch(error => {
        res.status(500).send({
          code:"WECO500",
          description: error.message
        });
      });
    })
  }

checkCompanyExist = (req, res, next) => {
    // Username
  let company_id = req.params.company_id ? req.params.company_id : req.body.company_id
  const query = "SELECT * FROM company WHERE company_id=$1 ORDER BY company_id DESC"
  const dataquery = [company_id];
  db.query(query, dataquery).then((results) => {
    console.log(results.rows)
    if(results.rows.length<=0){
        var ret = {"code":"WECO404","description":"Company Not found."}
        res.status(200).json(ret)
    }else{
      next();
    }
  }).catch(error => {
    res.status(500).send({
      code:"WECO500",
      description: error.message
    });
  });
};


function getCompanyById(req, res){
  return new Promise(function(resolve){
    let query = `SELECT a.active, a.company_name, a.address as company_address, a.company_id FROM company a WHERE a.active=$1 AND a.company_id=$2`
    let dataquery = ["T", req.params.company_id];
    db.query(query, dataquery).then((results) => {
      var dataReturn = {}
      if(results.rows.length>0){
        dataReturn["company_id"] = results.rows[0].company_id
        dataReturn["company_name"] = results.rows[0].company_name
        dataReturn["company_address"] = results.rows[0].company_address

        let queryDepartment = `SELECT a.department_name, a.department_id FROM department a WHERE a.company_id=$1`
        let dataqueryDepartment = [req.params.company_id];
        db.query(queryDepartment, dataqueryDepartment).then((resultsDept) => {
          if(resultsDept.rows.length>0){
            dataReturn["total_department"] = resultsDept.rows.length
            dataReturn["department"] = resultsDept.rows
          }else{
            dataReturn["total_department"] = 0
            dataReturn["department"] = []
          }
        })
        .catch(error => {
          res.status(500).send({
            code:"WECO500",
            description: error.message
          });
        });

        let queryUser = `SELECT a.user_id, a.firstname, a.lastname, b.position_name, c.department_name, a.image_url, a.gender
                        FROM users a LEFT JOIN positions b on b.position_id=a.position_id
                        LEFT JOIN department c on c.department_id=a.department_id
                        WHERE a.active=$1 AND a.company_id=$2`
        let dataqueryUser = ["T", req.params.company_id];
        db.query(queryUser, dataqueryUser).then((resultsUser) => {
          if(resultsUser.rows.length>0){
            dataReturn["total_users"] = resultsUser.rows.length
            dataReturn["users"] = resultsUser.rows
          }else{
            dataReturn["total_users"] = 0
            dataReturn["users"] = []
          }
          resolve(dataReturn)
        })
        .catch(error => {
          res.status(500).send({
            code:"WECO500",
            description: error.message
          });
        });
      }else{
        resolve(results.rows)
      }
    })
    .catch(error => {
      res.status(500).send({
        code:"WECO500",
        description: error.message
      });
    });
  })
}

function deleteCompany(req, res) {
  return new Promise(async (resolve) => {
      try {
          const result = await db.query(
              "DELETE FROM company WHERE company_id=$1",
              [req.params.company_id]
          );
          return resolve("complete");
      } catch (error) {
          console.error("### Error ", error);
          // return resolve(false);
          return res.status(500).send({
              code: "WECO500",
              description: error.message,
          });
      }
  });
}

function updateCompany(req, res){
    var time = moment();
    var dateNow = time.format('YYYY-MM-DD HH:mm:ss');
    const company_id = req.params.company_id
    const company_name = req.body.company_name
    const address = req.body.address
    const active = req.body.is_active
    const updateby = req.body.updateby
    const updatedate = dateNow
    
    return new Promise(function(resolve){
        const query = `UPDATE company
                        SET company_name=$1, 
                        address=$2, 
                        active=$3 ,
                        updateby=$4, 
                        updatedate=$5
                     WHERE company_id=$6
                     RETURNING company_id, company_name, address;`
        const dataquery = [company_name, 
                          address, 
                          active, 
                          updateby, 
                          updatedate,
                          company_id 
                        ];
        db.query(query, dataquery).then((results) => {
            resolve(results.rows[0])
        })
        .catch(error => {
            res.status(500).send({
                code:"WECO500",
                description: error.message
            });
        });
    })
}

const company = {
    companyList: companyList,
    createCompany: createCompany,
    checkDuplicateCompanyName:checkDuplicateCompanyName,
    checkCompanyExist: checkCompanyExist,
    getCompanyById: getCompanyById,
    deleteCompany: deleteCompany,
    updateCompany: updateCompany
};
module.exports = company;