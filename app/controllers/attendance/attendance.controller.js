const attendance = require("../../models/attendance/attendance");
const employee = require("../../models/user/employee");

// Get employee by companyId id
exports.attendanceList = async (req, res) => {
    var listAttendance = ""
    listAttendance = await attendance.attendanceList(req, res)
    console.log(listAttendance)
    if (listAttendance.length==0) {
        res.status(200).send({code:"WEAT001", description: "Attendance Not found." });
    }else{
        res.status(200).send({code:"WEAT200", "listAttendance": listAttendance, totalRow:listAttendance[0].total_row});
    }
};

exports.attendanceListByUser = async (req, res) => {
    var listAttendance = ""
    if(!req.params.user_id){
        res.status(200).send({code:"WEAT002", description: "User Id cannot Be Null." });
    }
    listAttendance = await attendance.attendanceListByUser(req, res)
    console.log(listAttendance)
    if (listAttendance.length==0) {
        res.status(200).send({code:"WEAT001", description: "Attendance Not found." });
    }else{
        res.status(200).send({code:"WEAT200", "listAttendance": listAttendance});
    }
};

// Get employee by id
exports.attendance = async (req, res) => {
    var attendanceData = "";
    var employeeData = "";
    if(!req.params.user_id){
        res.status(200).send({code:"WEAT002", description: "User Id cannot Be Null." });
    }
    if(!req.body.attendance_type){
        res.status(200).send({code:"WEAT003", description: "Attendance type cannot Be Null." });
    }else{
        if(req.body.attendance_type=="in"){
            var notCheckin = await attendance.checkHasCheckin(req, res)
            console.log(notCheckin)
            if(notCheckin){
                attendanceData = await attendance.checkin(req, res)
                if (attendanceData.length==0) {
                    res.status(404).send({code:"WEAT404", description: "Checkin Not Complete." });
                }else{
                    employeeData = await employee.getEmployee(req, res)
                    console.log(employeeData)
                    res.status(200).send({code:"WEAT200", "attendance": attendanceData, "employee_data": employeeData});
                }
            }
        }else{
            var notCheckout = false
            var canCheckout = await attendance.checkCanCheckOut(req, res)
            if(canCheckout){
                notCheckout = await attendance.checkHasCheckout(req, res)
            }
            console.log(canCheckout)
            console.log(notCheckout)
            if(canCheckout==true && notCheckout==true){
                attendanceData = await attendance.checkout(req, res)
                if (attendanceData.length==0) {
                    res.status(404).send({code:"WEAT404", description: "Checkin Not Complete." });
                }else{
                    employeeData = await employee.getEmployee(req, res)
                    console.log(employeeData)
                    res.status(200).send({code:"WEAT200", "attendance": attendanceData, "employee_data": employeeData});
                }
            }
        }
    }
};