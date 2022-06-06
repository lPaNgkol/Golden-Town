const position = require("../../models/position/position")

exports.positionList = async (req, res) => {
    var listPosition = ""
    listPosition = await position.positionList(req, res)
    console.log(listPosition)
    if (listPosition.length==0) {
        res.status(404).send({ message: "Position Id Not found." });
    }else{
        res.status(200).send({"listPosition": listPosition, totalRow:listPosition[0].total_row});
    }
  };
exports.createPosition = async (req, res) => {
    var positionData = ""
    if(!req.body.position_name){
        res.status(400).send({ message: "position_name cannot Be Null." });
    }
    positionData = await position.createPosition(req, res)
    if (positionData.length==0) {
        res.status(404).send({ message: "position Id Not found." });
    }else{
        res.status(200).send({positionData});
    }
};