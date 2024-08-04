/*
*Title: handle request and response
*Description: this page for handle the request and response
*Author: Nahid Hasan
*Date: Jul 8, 2024
*/

//dependencies
//{

//buffer to data. {} evabe module theke ekta ongsho distructure kore newar way
const {StringDecoder}=require('string_decoder');

//to findout the path of url  
const url=require('url'); 

//routes handler dependencies add
const routes = require('../routes/routes');

//not found handler dependecies add
const {notFoundHandler}=require('../handlers/routesHandler/notFoundHandler');

//utilites require
const {parseJSON}=require('../helpers/utilities');

//}


//module scaffolding
const handler={};

handler.handleReqRes=(req,res)=>{
    //request handle
    //get the url and parse it
    //using 2nd perameter true for localhost:3000/about584g0`-~ this kind of(584g0`-~) query string consideration
    const parsedUrl=url.parse(req.url,true);
    const path=parsedUrl.pathname;

    //1st perameter used for a pattern where onle first and last / will be removed, and second perameter used for what should be replaced with
    //the reason to do trimed path: some times our path could be /about/ and sometimes /about. we want to make it sense in one format thats for.....
    const trimedPath=path.replace(/^\/+|\/+$/g,'');
    
    //user kon method diye request koreche oita detect korte eta bebohar kora hoy.
    const method=req.method.toLowerCase();

    //if you want to seperate query then (we already parsed Url)
    const queryStringObject=parsedUrl.query;

    //jokhon amader kono request ashe tokhon onek header data o ashe. basically ei header data object hishebe ashe.
    const headerObject=req.headers; 



    //request Properties
    const requestProperties={
        parsedUrl,
        path,
        trimedPath,
        method,
        queryStringObject,
        headerObject,
    };


    //post
    //post request er body data kivabe fetch kora hoy. node js er body actually stream hishebe ashe. ekhane stream buffer concept ashe.
    //{
    //jehetu amader ekti object dorkar. so amader StringDecoder er ekti ovject create kore nite hobe.
    const decoder=new StringDecoder('utf-8');
    let realData='';

    //have to check trimed path is inside routes or not
    const choosenHandler=routes[trimedPath]?routes[trimedPath]:notFoundHandler;


    req.on('data',(buffer)=>{
        realData+=decoder.write(buffer);
    });
    
    req.on('end',()=>{
        realData+=decoder.end();

        //JSON data te convert
        requestProperties.body=parseJSON(realData);

        //JOkhon kaj kortechi client ke bole dite hobe ki type er data.
        //:
        //res.setHeader('Content-Type','application/json');

        choosenHandler(requestProperties,(statusCode,payload)=>{
            statusCode=typeof(statusCode)==='number'?statusCode:500;
            payload=typeof(payload)==='object'?payload:{};
    
            const payloadString=JSON.stringify(payload);
    
            
            //return the final response
            res.writeHead(statusCode);
            res.end(payloadString);
        });
        console.log(realData);
        //res.end('Hello world');
    });

    console.log(path);
    console.log(trimedPath);
    console.log(method);
    console.log(queryStringObject);
    console.log(headerObject);
    
    //response handle

};

module.exports=handler;