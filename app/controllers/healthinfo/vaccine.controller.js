const vaccine = require("../../models/healthinfo/vaccine");
const authJwt = require("../../models/user/authentication");

exports.vaccinelist = async (req, res) => {
  var listvaccine = "";
  listvaccine = await vaccine.vaccinelist(req, res);
  if (listvaccine.length == 0) {
    res
      .status(200)
      .send({ code: "WEVC401", description: "Vaccine Id Not found." });
  } else {
    res.status(200).send({
      listvaccine: listvaccine,
      totalRow: listvaccine[0].total_row,
    });
  }
};

exports.vaccinelistbycompanyId = async (req, res) => {
  var listvaccine = "";
  listvaccine = await vaccine.vaccinelistbycompanyId(req, res);
  console.log(listvaccine);
  if (listvaccine.length == 0) {
    res
      .status(200)
      .send({ code: "WEVC401", description: "vaccine Id Not found." });
  } else {
    res.status(200).send({
      totalRow: listvaccine[0].total_row,
      vaccineInfoList: listvaccine,
    });
  }
};

exports.vaccinelistbyuserId = async (req, res) => {
  var listvaccine = "";
  listvaccine = await vaccine.vaccinelistbyuserId(req, res);
  console.log(listvaccine);
  if (listvaccine.length == 0) {
    res
      .status(200)
      .send({ code: "WEVC401", description: "vaccine Id Not found." });
  } else {
    res.status(200).send({
      totalRow: listvaccine[0].total_row,
      vaccineInfoList: listvaccine,
    });
  }
};

exports.createvaccine = async (req, res) => {
  var vaccineData = "";
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEVC401", description: "Access Token Expired" });
  }
  vaccineData = await vaccine.createvaccine(req, res);
  if (vaccineData.length == 0) {
    res
      .status(200)
      .send({ code: "WEVC404", description: "vaccine Id Not found." });
  } else {
    res.status(200).send({ code: "WEVC200", message: "Success" });
  }
};

// update project team
exports.updatevaccine = async (req, res) => {
  try {
    let vaccineData = null;
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEVC401", description: "Access Token Expired" });
    }
    if (!req.params.user_id) {
      res
        .status(200)
        .send({ code: "WEVC404", description: "User ID Not found." });
    }
    if (!req.params.vaccine_info_id) {
      res
        .status(200)
        .send({ code: "WEVC404", description: "Vaccine ID Not Found" });
    }
    vaccineData = await vaccine.updatevaccine(req, res);
    if (vaccineData == false) {
      res
        .status(404)
        .send({ code: "WEVC404", description: "Health Info ID Not Found." });
    } else {
      res.status(200).send({ code: "WEVC200", message: "Success" });
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

exports.deletevaccine = async (req, res) => {
  var projectData = ""
  if(!req.params.vaccine_info_id){
      res.status(200).send({code:"WEVC400", description: "Vaccine id cannot be Null." });
  }
  if(!req.params.user_id){
    res.status(200).send({code:"WEVC400", description: "User id cannot be Null." });
}
  projectData = await vaccine.deletevaccine(req, res)
  console.log(projectData);
  if (projectData!="complete") {
      res.status(404).send({code:"WEVC404", description: "Vaccine Id Not found." });
  }else{
      res.status(200).send({code:"WEVC200", description: "Delete Complete!"});
  }
};


exports.useridCheck = async (req, res, next) => {
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEVC401", description: "Access Token Expired" });
  }
  useridCheck = await vaccine.useridCheck(req, res, next);
  if (useridCheck == 0) {
    res.status(200).send({ code: "WEVC404", description: "User ID Not Found" });
  }
  if (useridCheck == 1) {
    next();
  }
};


exports.deleteCheck = async (req, res, next) => {
  if (!req.params.user_id) {
    res
      .status(200)
      .send({ code: "WEVC404", description: "User Id Not found." });
  }
  if (!req.params.vaccine_info_id) {
    res
      .status(200)
      .send({ code: "WEVC404", description: "Vaccine Info Id Not found." });
  }
  let vcCheck = await vaccine.deleteCheck(req, res, next);
  if (vcCheck == 0){
    res.status(200).send({ code: "WEVC404", description: "Vaccine ID Not Found" });
  }
  else {
    next();
  }
}
