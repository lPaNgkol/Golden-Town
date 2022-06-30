const authJwt = require("../../models/user/authentication");
const projectteam = require("../../models/project/projectteam");

//  1get projectteambycompanyid;
exports.getProjectbyCompany = async (req, res) => {
  let getProject = "";
  getProject = await projectteam.ProjectTeambyCompany(req, res);
  if (getProject.length == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "No Employee in Company." });
  } else {
    res.status(200).send({
      companyId: getProject.rows,
      total: getProject.length,
      projectTeam: getProject,
    });
  }
};

//get projectteam;
exports.listProjectteam = async (req, res) => {
  let getProject = "";
  getProject = await projectteam.listProjectTeam(req, res);

  if (getProject.length == 0) {
    res.status(200).send({code: "WEPT200", total: getProject.length, projectTeam: getProject });
  } else {
    res.status(200).send({code: "WEPT200",
      total: getProject.length,
      projectTeam: getProject,
    });
  }
};


// create projectteam
exports.createProjectTeam = async (req, res) => {
  let createProject = null;
  createProject = await projectteam.createProjectTeam(req, res);
  res.status(200).send({ code: "WEPT200", description: "Success" });
};

// update projectteam;
exports.updateProjectteam = async (req, res) => {
  try {
    let updateProjectteam = null;

    updateProjectteam = await projectteam.updateProjectteam(req, res);
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEPT401", description: "Access Token Expired" });
    } else {
      res.status(200).send({
        code: "WEPT200",
        description: "Success",
      });
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

// delete projectteam;
exports.deleteProjectteam = async (req, res) => {
  try {
    let projectteamCk = await projectteam.deleteProjectteam(req, res);
    if (projectteamCk != "complete") {
      res
        .status(404)
        .send({ code: "WEPT404", description: "User id Not found." });
    } else {
      res.status(200).send({ code: "WEPT200", description: "Delete Complete" });
    }
    // console.log("ss testss", departmentData.length);
  } catch (error) {
    console.error("## ControlError ", error);
    return error;
  }
};
