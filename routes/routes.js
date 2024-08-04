/*
*Title: Routes 
*Description: Application routes
*Author: Nahid Hasan
*Date: Jul 8, 2024
*/

//dependencies
const { sampleHandler } = require("./../handlers/routesHandler/sampleHandlers");
const { userHandler } = require("./../handlers/routesHandler/userHandlers");
const { tokenHandler}=require("../handlers/routesHandler/tokenHandler");
const { checkHandler}=require("../handlers/routesHandler/checkHandler");

//routes object
const routes={
    'sample':sampleHandler,
    'user':userHandler,
    'token': tokenHandler,
    'check': checkHandler,
}

module.exports=routes;