const healthinfo = require("../../models/healthinfo/healthinfo");

exports.healthinfoList = async (req, res) => {
    var listHealthinfo = ""
    listHealthinfo = await healthinfo.healthinfoList(req, res)
    console.log(listHealthinfo)
    if (listHealthinfo.length==0) {
        res.status(404).send({ message: "Healthinfo Id Not found." });
    }else{
        res.status(200).send({"listHealthinfo": listHealthinfo, totalRow:listHealthinfo[0].total_row});
    }
  };

exports.createHealthinfo = async (req, res) => {
    var healthinfoData = ""
    if(!req.body.user_id){
        res.status(400).send({ message: "user_id cannot Be Null." });
    }
    healthinfoData = await healthinfo.createHealthinfo(req, res)
    if (healthinfoData.length==0) {
        res.status(404).send({ message: "healthinfo Id Not found." });
    }else{
        res.status(200).send({healthinfoData});
    }
};