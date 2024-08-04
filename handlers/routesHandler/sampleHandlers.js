/*
*Title: Sample Handler
*Description: Sample Handler
*Author: Nahid Hasan
*Date: Jul 8, 2024
*/

const handler={};

handler.sampleHandler=(requestProperties,callBack)=>{
    console.log(requestProperties);
    callBack(200,{
        message:'this is a sample'
    });
};

module.exports=handler;