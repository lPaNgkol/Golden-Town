const swaggerAutogen = require('swagger-autogen')()

const outputFile = './attendance_swagger_output.json'
const endpointsFiles = ['./app/routes/attendance.routes.js'
                        ]
const doc = {
    info: {
        version: "1.0.0",
        title: "Attendance API",
    },
    host: "we-links.defence-innovation.com:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
}
swaggerAutogen(outputFile, endpointsFiles, doc)

const outputFile5 = './company_swagger_output.json'
const endpointsFiles5 = [
                        './app/routes/company.routes.js'
                        ]
const doc5 = {
    info: {
        version: "1.0.0",
        title: "company API",
    },
    host: "we-links.defence-innovation.com:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
}
swaggerAutogen(outputFile5, endpointsFiles5, doc5)

const outputFile6 = './department_swagger_output.json'
const endpointsFiles6 = [
                        './app/routes/department.routes.js'
                        ]
const doc6 = {
    info: {
        version: "1.0.0",
        title: "department API",
    },
    host: "we-links.defence-innovation.com:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
}
swaggerAutogen(outputFile6, endpointsFiles6, doc6)

const outputFile7 = './healthinfo_swagger_output.json'
const endpointsFiles7 = [
                        './app/routes/healthinfo.routes.js'
                        ]
const doc7 = {
    info: {
        version: "1.0.0",
        title: "healthinfo API",
    },
    host: "we-links.defence-innovation.com:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
}
swaggerAutogen(outputFile7, endpointsFiles7, doc7)

const outputFile8 = './position_swagger_output.json'
const endpointsFiles8 = [
                        './app/routes/position.routes.js'
                        ]
const doc8 = {
    info: {
        version: "1.0.0",
        title: "position API",
    },
    host: "we-links.defence-innovation.com:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
}
swaggerAutogen(outputFile8, endpointsFiles8, doc8)

const outputFile9 = './project_swagger_output.json'
const endpointsFiles9 = [
                        './app/routes/project.routes.js',
                        './app/routes/projectteam.routes.js'
                        ]
const doc9 = {
    info: {
        version: "1.0.0",
        title: "project API",
    },
    host: "we-links.defence-innovation.com:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
}
swaggerAutogen(outputFile9, endpointsFiles9, doc9)

const outputFile10 = './employee_swagger_output.json'
const endpointsFiles10 = [
                        './app/routes/employee.routes.js',
                        './app/routes/user.routes.js'
                        ]
const doc10 = {
    info: {
        version: "1.0.0",
        title: "Employee API",
    },
    host: "we-links.defence-innovation.com:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
}
swaggerAutogen(outputFile10, endpointsFiles10, doc10)

const outputFile11 = './vaccine_swagger_output.json'
const endpointsFiles11 = ['./app/routes/vaccine.routes.js'
                        ]
const doc11 = {
    info: {
        version: "1.0.0",
        title: "Vaccine API",
    },
    host: "we-links.defence-innovation.com:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
}
swaggerAutogen(outputFile11, endpointsFiles11, doc11)