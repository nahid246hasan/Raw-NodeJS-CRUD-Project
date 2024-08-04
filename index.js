/*
*Title: Uptime Monitoring Application
*Description: A RESTFUL API to monitor up or down time of user define links.
*Author: Nahid Hasan
*Date: Jul 8, 2024
*/

//dependencies

//http method required
const http=require('http');

//handleReqRes.js file theke handleReqRes function require kora.
//amra handleReqRes.js file theke only handleReqRes function gather korlam using {}
const {handleReqRes}=require('./helpers/handleReqRes');

//environments dependecies add
const environment=require('./helpers/environments');

//data dependencies add
const data=require('./lib/data');

//app object- module scaffolding
const app={};

////////////////////////////////////////////////////////////////////////////////
//testing file system
//@ToDo: will remove later.
//Create or write File
// data.create('test','newFile',{'name':'Bangladesh','language':'bangla'},(err)=>{
//     console.log(`${err}`);
// });
//Read existing file
// data.read('test','newFile',(err,data)=>{
//     console.log(`${data}`);
//     console.log(`${err}`);
// });
//Update existing file
// data.update('test','newFile',{'name':'USA','language':'english'},(err)=>{
//     console.log(err);
// });
//Deleting Existing File
// data.delete('test','newFile',(err)=>{
//     console.log(err);
// });


//configuration
//ekhane amra shob dhoroner configuration rakhte cheyechilam. but this is not good practice.
//that for came environment variable concept(terminal e likhte hoy.  ex: NODE_ENV=production node index)
//access nite hole ex: console.log(process.env.NODE_ENV) //for visualization using console.log()
// app.config={
//     port:3000
// };

//create server
app.CreateServer=()=>{
    const server= http.createServer(app.handleReqRes);

    //listen port
    server.listen(environment.port,()=>{
        console.log(`listening on port ${environment.port}`);
    });
};



//handle request response
app.handleReqRes=handleReqRes;

//start the server
app.CreateServer();
