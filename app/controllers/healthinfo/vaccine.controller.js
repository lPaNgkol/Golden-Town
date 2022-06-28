const vaccine = require("../../models/healthinfo/vaccine");
const authJwt = require("../../models/user/authentication");

exports.vaccinelist = async (req, res) => {
  var listvaccine = "";
  listvaccine = await vaccine.vaccinelist(req, res);
  // console.log("listvaccine",  listvaccine.length)
  if (listvaccine.length == 0) {
    res
      .status(404)
      .send({ code: "WEVA404", description: "Vaccine Id Not found." });
  } else {
    res.status(200).send({
      code: "WEVA200",
      total: listvaccine.length,
      listvaccine: listvaccine,
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
      .send({ code: "WEVA401", description: "No Employee in Company." });
  } else {
    res.status(200).send({
      totalRow: listvaccine.length,
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
      .status(404)
      .send({ code: "WEVA404", description: "User Id Not found." });
  } else {
    res.status(200).send({
      code: "WEVA200",
      total: listvaccine.length,
      vaccineInfoList: listvaccine,
    });
  }
};

exports.createvaccine = async (req, res) => {
  var vaccineData = "";

  vaccineData = await vaccine.createvaccine(req, res);

  if (!req.params.user_id) {
    res
      .status(200)
      .send({ code: "WEVA400", description: "User id cannot be Null." });
  }
  console.log("vaccineData", vaccineData);

  if (vaccineData.length == 0) {
    res
      .status(404)
      .send({ code: "WEVA404", description: "Vaccine Id Not found." });
  } else {
    res.status(200).send({ code: "WEVA200", message: "Success", vaccineData });
  }
};

// update project team
exports.updatevaccine = async (req, res) => {
  try {
    let vaccineData = null;
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEVA401", description: "Access Token Expired" });
    }
    if (!req.params.user_id) {
      res
        .status(200)
        .send({ code: "WEVA400", description: "User ID Cannot be null" });
    }
    if (!req.params.vaccine_info_id) {
      res
        .status(200)
        .send({ code: "WEVA400", description: "Vaccine ID Cannot be null" });
    }
    vaccineData = await vaccine.updatevaccine(req, res);
    if (vaccineData == false) {
      res
        .status(404)
        .send({ code: "WEVA404", description: "Vaccine ID Not Found." });
    } else {
      res.status(200).send({ code: "WEVA200", message: "Success" });
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

exports.deletevaccine = async (req, res) => {
  var projectData = "";
  if (!req.params.vaccine_info_id) {
    res
      .status(200)
      .send({ code: "WEVA400", description: "Vaccine id cannot be Null." });
  }
  if (!req.params.user_id) {
    res
      .status(200)
      .send({ code: "WEVA400", description: "User id cannot be Null." });
  }
  projectData = await vaccine.deletevaccine(req, res);
  console.log(projectData);
  if (projectData != "complete") {
    res
      .status(404)
      .send({ code: "WEVA404", description: "Vaccine Id Not found." });
  } else {
    res.status(200).send({ code: "WEVA200", description: "Delete Complete!" });
  }
};


exports.deleteCheck = async (req, res, next) => {
  let vcCheck = await vaccine.deleteCheck(req, res, next);
  // console.log("VC",vcCheck);
  if (!req.params.user_id) {
    res
      .status(200)
      .send({ code: "WEVA400", description: "User Id Cannot be null" });
  }
  if (!req.params.vaccine_info_id) {
    res
      .status(200)
      .send({ code: "WEVA400", description: "Vaccine ID Cannot be null" });
  }
  if (vcCheck == 0) {
    res
      .status(404)
      .send({ code: "WEVA404", description: "Vaccine ID Not Found" });
  } else {
    next();
  }
};
