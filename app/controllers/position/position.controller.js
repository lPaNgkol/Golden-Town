const position = require("../../models/position/position");
const authJwt = require("../../models/user/authentication");

exports.positionList = async (req, res) => {
  var listPosition = "";
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  }
  listPosition = await position.positionList(req, res);
  console.log(listPosition);
  if (listPosition.length == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "Position Id Not found." });
  } else {
    res.status(200).send({
      total: listPosition.length,
      listPosition: listPosition,
    });
  }
};

exports.positioncompanyList = async (req, res) => {
  var listPosition = "";
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  }
  listPosition = await position.positioncompanyList(req, res);
  console.log(listPosition);
  if (listPosition.length == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "No Employee in Company." });
  } else {
    res.status(200).send({
      total: listPosition.length,
      listPosition: listPosition,
    });
  }
};

exports.createPosition = async (req, res) => {
  var positionData = "";
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  }
  if (!req.body.position_name) {
    res
      .status(200)
      .send({ code: "WEPT400", description: "Position_name cannot Be Null." });
  }
  positionData = await position.createPosition(req, res);
  if (positionData.length == 0) {
    res.status(200).send({ code: "WEPT403", description: "Company not Found" });
  } else {
    res.status(200).send({ positionData });
  }
};

// update department
exports.updatePosition = async (req, res) => {
  try {
    var updateData = null;
    var checkData = null;
    checkData = await position.positionCheck(req, res);
    if (!req.body.position_name) {
      res.status(200).send({
        code: "WEPT400",
        description: "Position_name cannot Be Null.",
      });
    }
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEPT401", description: "Access Token Expired" });
    }
    updateData = await position.updatePosition(req, res);
    if (checkData == 0) {
      res
        .status(200)
        .send({ code: "WEPT404", description: "Position not Found." });
    }
    res.status(200).send({ code: "WEPT200", description: "Success" });
    console.log("positionData", checkData);
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

// delete Positio
exports.deletePosition = async (req, res) => {
  try {
    let positionDl = "";
    positionDl = await position.positionCheck(req, res);
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEPT401", description: "Access Token Expired" });
    }
    console.log("ss test", positionDl.length);
    if (positionDl.length == 0) {
      res
        .status(200)
        .send({ code: "WEPT404", description: "Position not Found." });
    }
    if (!positionDl.length == 0) {
      positionDl = await position.deletePosition(req, res);
      res
        .status(200)
        .send({ code: "WEPT200", description: "Position not Found." });
    }
    // console.log("positionDl test", positionDl.length);
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

exports.positionnameCheck = async (req, res, next) => {
  try {
    let nameCheck = null;
    nameCheck = await position.positionnameCheck(req, res);
    console.log("positionnameCheck", nameCheck);
    if (nameCheck > 0) {
      res.status(400).send({ message: "Position_name already in use" });
    }
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEDP401", description: "Access Token Expired" });
    }
    if (nameCheck == 0) {
      next();
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

exports.positioncompanyCheck = async (req, res, next) => {
  try {
    let nameCheck = null;
    nameCheck = await position.positioncompanyCheck(req, res);
    console.log("positionnameCheck", nameCheck);
    if (nameCheck == 0) {
      res.status(400).send({ message: "Company not found" });
    }
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEDP401", description: "Access Token Expired" });
    }
    if (nameCheck > 0) {
      next();
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

exports.departmentCheck = async (req, res, next) => {
  try {
    let nameCheck = null;
    nameCheck = await position.departmentidCheck(req, res);
    console.log("departmentidCheck", nameCheck);
    if (nameCheck == 0) {
      res.status(400).send({ message: "Department not found" });
    }
    if (nameCheck > 0) {
      next();
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};
