const db = require("../dbconnection");
var moment = require('moment');

checkProjectExist = (req, res, next) => {
    // Username
    const query = "SELECT * FROM project_on_hand WHERE project_on_hand_id=$1 AND active=$2 ORDER BY project_on_hand_id DESC"
    const dataquery = [req.params.project_id, "T"];
    db.query(query, dataquery).then((results) => {
      if(results.rows.length>0){
        next();
      }else{
        var ret = {"code":"WEPO404","description":"Project not exist"}
        res.status(200).json(ret)
      }
    }).catch(error => {
      res.status(500).send({
        code:"WEPO500",
        description: error.message
      });
    });
  };

checkDuplicateProjectCode = (req, res, next) => {
    // Username
    let query=""
    let dataquery=""
    if(req.params.project_id){
        query = "SELECT * FROM project_on_hand WHERE project_code=$1 AND active=$2 AND project_on_hand_id!=$3 ORDER BY project_on_hand_id DESC"
        dataquery = [req.body.project_code, "T", req.params.project_id];
    }else{
        query = "SELECT * FROM project_on_hand WHERE project_code=$1 AND active=$2 ORDER BY project_on_hand_id DESC"
        dataquery = [req.body.project_code, "T"];
    }
    
    db.query(query, dataquery).then((results) => {
      if(results.rows.length>0){
          var ret = {"code":"WEPO001","description":"Project Code already in use"}
          res.status(200).json(ret)
      }else{
        next();
      }
    }).catch(error => {
      res.status(500).send({
        code:"WEPO500",
        description: error.message
      });
    });
  };

function createProject(req, res){

    var time = moment();
    var dateNow = time.format('YYYY-MM-DDTHH:mm:ss');
    const project_name = req.body.project_name
    const project_code = req.body.project_code
    const project_status = req.body.project_status
    const company_id = req.params.company_id
    const project_desc = req.body.project_desc
    const due_date = req.body.due_date
    const note = req.body.note
    const active = "T"
    const createby = req.body.createby
    const createdate = dateNow
    const updateby = req.body.createby
    const updatedate = dateNow
    const project_image = req.body.project_image

    return new Promise(function(resolve){
        const query = `INSERT INTO project_on_hand(project_name, project_code, project_status, note, company_id, project_image,
                                                 project_desc, due_date, active, createby, createdate, updateby, updatedate) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)  RETURNING project_on_hand_id;`
        const dataquery = [project_name, 
                         project_code,
                         project_status,
                         note,
                         company_id,
                         project_image,
                         project_desc,
                         due_date,
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
                code:"WEPO500",
                description: error.message
            });
        });
    })
}

function updateProject(req, res){
    var time = moment();
    var dateNow = time.format('YYYY-MM-DD HH:mm:ss');
    const project_id = req.params.project_id
    const project_name = req.body.project_name
    const project_code = req.body.project_code
    const project_status = req.body.project_status
    const company_id = req.body.company_id
    const project_desc = req.body.project_desc
    const due_date = req.body.due_date
    const note = req.body.note
    const project_image = req.body.project_image
    const active = req.body.is_active
    const updateby = req.body.updateby
    const updatedate = dateNow
    
    return new Promise(function(resolve){
        const query = `UPDATE project_on_hand
                        SET project_name=$1, 
                        project_code=$2, 
                        project_status=$3 ,
                        company_id=$4, 
                        project_desc=$5, 
                        due_date=$6, 
                        note=$7, 
                        project_image=$8,
                        active=$9, 
                        updateby=$10, 
                        updatedate=$11
                     WHERE project_on_hand_id = $12
                     RETURNING project_on_hand_id;`
        const dataquery = [project_name, 
                         project_code, 
                         project_status, 
                         company_id, 
                         project_desc, 
                         due_date, 
                         note, 
                         project_image, 
                         active,
                         updateby,
                         updatedate,
                         project_id
                        ];
        db.query(query, dataquery).then((results) => {
            resolve(results.rows[0])
        })
        .catch(error => {
            res.status(500).send({
                code:"WEPO500",
                description: error.message
            });
        });
    })
}

function deleteProject(req, res) {
    return new Promise(async (resolve) => {
        try {
            const result = await db.query(
                "DELETE FROM project_on_hand WHERE project_on_hand_id=$1",
                [req.params.project_id]
            );
            return resolve("complete");
        } catch (error) {
            console.error("### Error ", error);
            // return resolve(false);
            return res.status(500).send({
                code: "WEPO500",
                description: error.message,
            });
        }
    });
}


function listProject(req, res) {
    return new Promise(function(resolve){
        var dataReturn = {}
        let query = `SELECT *, count(a.*) OVER() AS total_row, COUNT(a.project_status) filter (where a.project_status  not in ('hold', 'rejected', 'done' )) OVER() as on_going
                    FROM project_on_hand a 
                    WHERE a.active=$1 AND company_id=$2`
        let dataquery = ["T", req.params.company_id];
        db.query(query, dataquery).then((results) => {
            if(results.rows.length>0){
                dataReturn["code"] = "WEPO200"
                dataReturn["company_id"] = req.params.company_id
                dataReturn["total_row"] = results.rows[0]['total_row']
                dataReturn["on_going"] = results.rows[0]['on_going']
                dataReturn['projects'] = []
                results.rows.forEach(project => {
                    var dataProject = {}
                    dataProject['project_id'] = project["project_on_hand_id"]
                    dataProject['project_code'] = project["project_code"]
                    dataProject['project_image'] = project["project_image"]
                    dataProject['project_name'] = project["project_name"]
                    dataProject['project_status'] = project["project_status"]
                    dataProject['project_desc'] = project["project_desc"]
                    dataProject['note'] = project["note"]
                    dataProject['due_date'] = project["due_date"]
                    dataProject['is_active'] = project["active"]
                    dataProject['project_team'] = []

                    let queryTeam = `SELECT *, count(a.*) OVER() AS total_team, b.firstname, b.lastname, b.image_url
                                    FROM project_team a 
                                    LEFT JOIN users b on a.user_id=b.user_id
                                    WHERE a.active=$1 AND project_on_hand_id=$2`
                    let dataqueryTeam = ["T", project["project_on_hand_id"]];

                    db.query(queryTeam, dataqueryTeam).then((resultTeam) => {
                        if(resultTeam.rows.length>0){
                            resultTeam.rows.forEach(projectTeam => {
                                var dataProjectMember = {}
                                dataProjectMember['user_id'] = projectTeam["user_id"]
                                dataProjectMember['firstname'] = projectTeam["firstname"]
                                dataProjectMember['lastname'] = projectTeam["lastname"]
                                dataProjectMember['team_position'] = projectTeam["team_position"]
                                dataProjectMember['image_url'] = projectTeam["image_url"]
                                dataProjectMember['owner'] = projectTeam["owner"]
                                console.log(dataProjectMember)
                                dataProject['project_team'].push(dataProjectMember)
                            })
                            dataProject['total_team'] = resultTeam.rows[0]["total_team"]
                        }else{
                            dataProject['project_team'] = []
                            dataProject['total_team'] = 0
                        }
                        dataReturn['projects'].push(dataProject)
                        if(dataReturn['projects'].length==results.rows.length){
                            resolve(dataReturn)
                        }
                    })
                    .catch(error => {
                        res.status(500).send({
                        code:"WEPO500",
                        description: error.message
                        });
                    });
                });
            }else{
                resolve(results.rows)
            }
        })
        .catch(error => {
            res.status(500).send({
            code:"WEPO500",
            description: error.message
            });
        });
    })
}
  
const project = {
    createProject: createProject,
    checkDuplicateProjectCode: checkDuplicateProjectCode,
    updateProject: updateProject,
    checkProjectExist: checkProjectExist,
    deleteProject: deleteProject,
    listProject: listProject
};
module.exports = project;