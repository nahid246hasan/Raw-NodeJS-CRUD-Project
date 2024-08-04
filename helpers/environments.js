/*
*Title: Environment
*Description: Handle All Environments related things
*Author: Nahid Hasan
*Date: Jul 10, 2024
*/

//dependencies

//  module Scaffolding
const environments={};

environments.staging={
    port:3000,
    envName: 'staging',
    secretKey: 'shsfkjdghgdh',
    maxChecks:5,
    twilio:{
        fromPhone: ""
    }
};

environments.production={
    port: 5000,
    envName: 'production',
    secretKey:'shgdkghjdghdfgg',
    maxChecks:5,
    twilio:{
        fromPhone: ""
    }
};

//determin which environments was pass
const currentEnvironment=typeof(process.env.NODE_ENV)==='string'?process.env.NODE_ENV:'staging';

//export corresponding environment object 
//in this line we are finding that which environment object we are using
const environmentToExport=typeof(environments[currentEnvironment]==='object')?environments[currentEnvironment]:environments.staging;

//export module
module.exports=environmentToExport;