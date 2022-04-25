const attendance = require("../../models/attendance/attendance");

// Get employee by companyId id
exports.attendanceList = async (req, res) => {
    var listAttendance = ""
    listAttendance = await attendance.listAttendance(req, res)
    console.log(listAttendance)
    if (listAttendance.length==0) {
        res.status(404).send({ message: "Attendance Not found." });
    }else{
        res.status(200).send({"listAttendance": listAttendance, totalRow:listEmployee[0].total_row});
    }
  };

// Get employee by id
exports.checkin = async (req, res) => {
    var attendanceData = ""
    if(!req.params.user_id){
        res.status(400).send({ message: "User Id cannot Be Null." });
    }
    attendanceData = await attendance.checkin(req, res)
    if (attendanceData.length==0) {
        res.status(404).send({ message: "Checkin Not Complete." });
    }else{
        res.status(200).send({"atttendance": attendanceData});
    }
};

exports.checkout = async (req, res) => {
    var attendanceData = ""
    if(!req.params.user_id){
        res.status(400).send({ message: "User Id cannot Be Null." });
    }
    attendanceData = await attendance.checkout(req, res)
    if (attendanceData.length==0) {
        res.status(404).send({ message: "Attendance Not found." });
    }else{
        res.status(200).send({"attendanceData": attendanceData});
    }
};