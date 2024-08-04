/*
*Title: Utilities
*Description: Emportant Utilities functions
*Author: Nahid Hasan
*Date: Jul 10, 2024
*/

//dependencies
//data hashing er jonno
const crypto=require('crypto');

//require environment path
const environments=require('./environments');

//  module Scaffolding
const utilities={};

//parse JSON string to object
utilities.parseJSON=(jsonString)=>{
    let output;

    try{
        output=JSON.parse(jsonString);
    }catch{
        output={};
    }
    return output;
}

//hashing
utilities.hash=(str)=>{
    if(typeof(str)==='string'&&str.length>0){
        let hash=crypto.createHmac('sha256',environments.secretKey).update(str).digest('hex');

        return hash;
    }
    else{
        return false;
    }
}

//create random string
utilities.createRandomString=(strLength)=>{
    let length=strLength;
    length=typeof(strLength)==='number'&&strLength>0?strLength:false;

    if(length){
        let possiblecharecters='abcdefghijklmnopqrstuvwxyz1234567890';
        let output='';
        for(let i=1; i<= length; i+=1){
            let radomCharacter=possiblecharecters.charAt(Math.floor(Math.random()*possiblecharecters.length));
            output+=radomCharacter;
        }
        return output;
    }
    else{
        return false;
    }
}




//export module
module.exports=utilities;