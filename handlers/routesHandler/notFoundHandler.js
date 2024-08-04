/*
*Title: Not Found Handler
*Description: Not Found Handler
*Author: Nahid Hasan
*Date: Jul 8, 2024
*/

const handler={};

handler.notFoundHandler=(requestProperties,callBack)=>{
    console.log(requestProperties);
    callBack(404,{
        message:'this is a not found handler'
    });
};

module.exports=handler;