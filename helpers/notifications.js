/*
*Title: Notification Libraries
*Description: important function to notify users(notification services)
*Author: Nahid Hasan
*Date: Jul 27, 2024
*/

//dependecies
const https=require('https');

const {twilio}=require("./environments");

//object ke string e convert korte eta use hoy. 
const queryString=require("querystring");
const { hostname } = require('os');
const { METHODS } = require('http');

//module scafolding
const notifications={};

//send sms to user using twilio api
notifications.sendTwilioSms=(phone,msg,callback)=>{
    //input validation
    const userPhone=typeof(phone)==='string'&&phone.trim().length===11?phone.trim():false;

    const userMsg=typeof( msg)==='string'&&msg.trim().length>0&&msg.trim().length<=1600?msg.trim():false;

    if(userPhone&&userMsg){
        //configure the request payload
        const payload={
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body:userMsg
        }

        //stringify the payload(we can use stringify but in this case we will use node js library queryString)
        const stringifyPayload=queryString.stringify(payload);

        //configure the request details
        const requestDetailsObject={
            hostname:`api.twilio.com`,
            method: `POST`,
            path:`/2010-04-01/Accounts/{AccountSid}/Messages.json`
        }

    }else{
        callback('Given parameters were missing or invalid!');
    }
};

module.exports=notifications;