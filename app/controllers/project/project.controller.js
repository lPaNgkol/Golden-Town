const project = require("../../models/project/project")
let fs = require('fs');

exports.createProject = async (req, res) => {
    var projectData = ""
    if(!req.params.company_id){
        res.status(200).send({code:"WEPO400", description: "Company id cannot be Null." });
    }
    if(!req.body.project_name){
        res.status(200).send({code:"WEPO400", description: "Project name cannot be Null." });
    }
    if(!req.body.project_code){
        res.status(200).send({code:"WEPO400", description: "Project code cannot be Null." });
    }
    if (req.files) {
        const file = req.files.project_image
        const fileName = file.name
        let dir = __dirname.split("/app")[0]
        fs.mkdir(`./upload/project/${req.body.project_code}`, {recursive: true}, (err) => {
            if (err) {
                console.error(err);
            }else{

                file.mv(`./upload/project/${req.body.project_code}/${fileName}`, async (err) => {
                    req.body.project_image = `${dir}/upload/project/${req.body.project_code}/${fileName}`

                    projectData = await project.createProject(req, res)
                    if (projectData.length==0) {
                        res.status(404).send({code:"WEPO404", description: "Company Id Not found." });
                    }else{
                        res.status(200).send({code:"WECO200", projectData});
                    }
                })
            }
            console.log('Directory created successfully!');
        });
    }else{
        projectData = await project.createProject(req, res)
        if (projectData.length==0) {
            res.status(404).send({code:"WEPO404", description: "Company Id Not found." });
        }else{
            res.status(200).send({code:"WECO200", projectData});
        }
    }
};

exports.deleteProject = async (req, res) => {
    var projectData = ""
    if(!req.params.project_id){
        res.status(200).send({code:"WEPO400", description: "Project id cannot be Null." });
    }
    projectData = await project.deleteProject(req, res)
    console.log(projectData);
    if (projectData!="complete") {
        res.status(404).send({code:"WEPO404", description: "Project Id Not found." });
    }else{
        res.status(200).send({code:"WEPO200", description: "Delete Complete!"});
    }
};

exports.updateProject = async (req, res) => {
    var projectData = ""

    if(!req.params.project_id){
        res.status(200).send({code:"WEPO400", description: "Project id cannot be Null." });
    }
    if(!req.body.project_name){
        res.status(200).send({code:"WEPO400", description: "Project name cannot be Null." });
    }
    if(!req.body.project_code){
        res.status(200).send({code:"WEPO400", description: "Project code cannot be Null." });
    }
    if (req.files) {
        const file = req.files.project_image
        const fileName = file.name
        let dir = __dirname.split("/app")[0]
        fs.mkdir(`./upload/project/${req.body.project_code}`, {recursive: true}, (err) => {
            if (err) {
                console.error(err);
            }else{

                file.mv(`./upload/project/${req.body.project_code}/${fileName}`, async (err) => {
                    req.body.project_image = `${dir}/upload/project/${req.body.project_code}/${fileName}`

                    projectData = await project.updateProject(req, res)
                    if (projectData.length==0) {
                        res.status(404).send({code:"WEPO404", description: "Company Id Not found." });
                    }else{
                        res.status(200).send({code:"WECO200", projectData});
                    }
                })
            }
            console.log('Directory created successfully!');
        });
    }else{
        projectData = await project.updateProject(req, res)
        if (projectData.length==0) {
            res.status(404).send({code:"WEPO404", description: "Company Id Not found." });
        }else{
            res.status(200).send({code:"WECO200", projectData});
        }
    }
};