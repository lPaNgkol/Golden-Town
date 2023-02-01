const reserve = require("../../models/reserve/reserve");

exports.reserveList = async (req, res) => {
  var listReserve = "";
  listReserve = await reserve.reserveList(req, res);
  if (listReserve.length == 0) {
    res.status(404).send({
      code: "RESL404",
      description: "Reserve Not found."
    });
  } else {
    res.status(200).send({
      code: "RESL200",
      total: listReserve.length,
      listReserve: listReserve,
    });
  };
};

exports.reserveListAdmin = async (req, res) => {
  var listReserveAdmin = "";
  listReserveAdmin = await reserve.reserveListAdmin(req, res);
  if (listReserveAdmin.length == 0) {
    res.status(404).send({
      code: "RESL404",
      description: "Reserve Not found."
    });
  } else {
    res.status(200).send({
      code: "RESL200",
      total: listReserveAdmin.length,
      listReserve: listReserveAdmin,
    });
  };
};

exports.reserveListUserId = async (req, res) => {
  var listReserveUserId = "";
  listReserveUserId = await reserve.reserveListUserId(req, res);
  if (listReserveUserId.length == 0) {
    res.status(404).send({
      code: "RESL404",
      description: "Reserve Id Not found."
    });
  } else {
    res.status(200).send({
      code: "RESL200",
      total: listReserveUserId.length,
      listReserve: listReserveUserId,
    });
  };
};

exports.reserveListReserveId = async (req, res) => {
  var listReserveId = "";
  listReserveId = await reserve.reserveListReserveId(req, res);
  if (listReserveId.length == 0) {
    res.status(404).send({
      code: "RESL404",
      description: "Reserve Id Not found."
    });
  } else {
    res.status(200).send({
      code: "RESL200",
      total: listReserveId.length,
      listReserve: listReserveId,
    });
  };
};

exports.reserveCreate = async (req, res) => {
  var createReserve = "";
  createReserve = await reserve.reserveCreate(req, res);
  if (createReserve.length == 0) {
    res.status(404).send({
      code: "RESL404",
      description: "Reserve Not found."
    });
  } else {
    res.status(200).send({
      code: "RESL200",
      reserve_id: createReserve,
      description: "Create Reserve Success."
    });
  };
};

exports.reserveUpdate = async (req, res) => {
  var updateReserve = "";
  updateReserve = await reserve.reserveUpdate(req, res);
  if (updateReserve.length == 0) {
    res.status(404).send({
      code: "RESL404",
      description: "Reserve Not found."
    });
  } else {
    res.status(200).send({
      code: "RESL200",
      description: "Update Reserve Success."
    });
  };
};