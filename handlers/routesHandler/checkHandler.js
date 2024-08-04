/*
*Title: _check Handler
*Description: Handler to user defined _check routes
*Author: Nahid Hasan
*Date: Jul 26, 2024
*/

//dependencies
const data=require('../../lib/data');

const {parseJSON, createRandomString}=require('../../helpers/utilities');

const tokenHandler=require('../../handlers/routesHandler/tokenHandler');

const {maxChecks}=require('../../helpers/environments');


//module scaffolding
const handler={};

handler.checkHandler=(requestProperties,callback)=>{
     
    //_checking is it get,post,put or delete
    const acceptedMethods=['get','post','put','delete'];
    if(acceptedMethods.indexOf(requestProperties.method)>-1){
        handler._check[requestProperties.method](requestProperties,callback);
    }
    else{
        callback(405);
    }
}

//nested module scaffolding
handler._check={}

handler._check.post=(requestProperties,callback)=>{
    let protocol = typeof(requestProperties.body.protocol)==='string'&&['http','https'].
    indexOf(requestProperties.body.protocol)>-1?requestProperties.body.protocol:false;

    let url=typeof(requestProperties.body.url)==='string'&&requestProperties.body.url.trim().length>0?
    requestProperties.body.url:false;

    let method =typeof(requestProperties.body.method)==='string'&&['GET','POST','PUT','DELETE'].
    indexOf(requestProperties.body.method)>-1?requestProperties.body.method:false;

    let successCodes=typeof(requestProperties.body.successCodes)==='object'&&requestProperties.body.successCodes instanceof Array? 
    requestProperties.body.successCodes:false;

    let timeoutSeconds=typeof(requestProperties.body.timeoutSeconds)==='number'&&requestProperties.body.timeoutSeconds%1===0
    &&requestProperties.body.timeoutSeconds>=1&&requestProperties.body.timeoutSeconds<=5?requestProperties.body.timeoutSeconds:false;

    if(protocol && url &&method && successCodes && timeoutSeconds){
        let token=typeof(requestProperties.headerObject.token)==='string'?requestProperties.headerObject.token:false;

        //lookup the user phone by reading the token
        data.read('tokens',token,(err1,tokenData)=>{
            if(!err1&&tokenData){
                let userPhone=parseJSON(tokenData).phoneNumber;
                //lookup the user data
                data.read('users',userPhone,(err2,userData)=>{
                    if(!err2&&userData){
                        
                        tokenHandler._token.varify(token,userPhone,(tokenIsValid)=>{
                            console.log(tokenIsValid);
                            if(tokenIsValid){
                                let userObject = parseJSON(userData);
                                console.log("///////////////////////////");
                                console.log(userObject);
                                let userChecks=typeof(userObject.checks)==='object'&&userObject.checks instanceof Array ? userObject.checks:[];
                                if(userChecks.length<maxChecks){
                                    let checkId= createRandomString(20);//createRandomString is a built in function
                                    let checkObject={
                                        'id':checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds,
                                    }

                                    data.create('checks',checkId,checkObject,(err3)=>{
                                        if(!err3){
                                            //add check id tho the user's object
                                            userObject.checks=userChecks;
                                            userObject.checks.push(checkId);

                                            //save the new user data
                                            data.update('users',userPhone,userObject,(err4)=>{
                                                if(!err4){
                                                    //return the data about the new check
                                                    callback(200,checkObject);
                                                }else{
                                                    callback(500,{
                                                        error:'There was a problem in the server side!',
                                                    });
                                                }
                                            })
                                        }else{
                                            callback(
                                                500,{
                                                    error:'There was a problem in the server side!'
                                                }
                                            )
                                        }
                                    })
                                }
                                else{
                                    callback(401,{
                                        error:'User has already reached max check limit!',
                                    })
                                }
                            }
                            else{
                                callback(403,{
                                    error:'Authentication problem!',
                                });
                            }
                        })
                    }else{
                        callback(403,{
                            error:'User not found!',
                        })
                    }
                })
            }else{
                callback(403,{
                    error:'Authentication problem!',
                });
            }
        })
    }
    else{
        callback(
            400,{
                error: 'You have a problem in your request',
            }
        );
    }
}

//@TODO: Authentication
handler._check.get=(requestProperties,callback)=>{
    const id=typeof(requestProperties.queryStringObject.id)==='string'&& requestProperties.queryStringObject.id.trim().
    length==20?requestProperties.queryStringObject.id:false;

    if(id){
        //lookup the check
        data.read('checks',id ,(err1,checkData)=>{
            if(!err1 && checkData){
                let token=typeof(requestProperties.headerObject.token)==='string'?requestProperties.headerObject.token:false;
                tokenHandler._token.varify(token,parseJSON(checkData).userPhone,(tokenIsValid)=>{
                    console.log(tokenIsValid);
                    if(tokenIsValid){
                        callback(200,parseJSON(checkData))
                    }
                    else{
                        callback(403,{
                            error:'Authentication problem!',
                        });
                    }
                });
            }else{
                callback(404,{'error':'You have a problem in your request!'});
            }
        })
    }else{
        callback(404,{'error':'You have a problem in your request!'});
    }
    
}

//@TODO: Authentication
handler._check.put=(requestProperties,callback)=>{
    const id=typeof(requestProperties.body.id)==='string'&& requestProperties.body.id.trim().
    length===20?requestProperties.body.id:false;

    let protocol = typeof(requestProperties.body.protocol)==='string'&&['http','https'].
    indexOf(requestProperties.body.protocol)>-1?requestProperties.body.protocol:false;

    let url=typeof(requestProperties.body.url)==='string'&&requestProperties.body.url.trim().length>0?
    requestProperties.body.url:false;

    let method =typeof(requestProperties.body.method)==='string'&&['GET','POST','PUT','DELETE'].
    indexOf(requestProperties.body.method)>-1?requestProperties.body.method:false;

    let successCodes=typeof(requestProperties.body.successCodes)==='object'&&requestProperties.body.successCodes instanceof Array? 
    requestProperties.body.successCodes:false;

    let timeoutSeconds=typeof(requestProperties.body.timeoutSeconds)==='number'&&requestProperties.body.timeoutSeconds%1===0
    &&requestProperties.body.timeoutSeconds>=1&&requestProperties.body.timeoutSeconds<=5?requestProperties.body.timeoutSeconds:false;

    if(id){
        if(protocol||url||method||successCodes||timeoutSeconds){
            data.read('checks',id,(err1,checkData)=>{
                if(!err1&&checkData){
                    let checkObject=parseJSON(checkData);
                    let token=typeof(requestProperties.headerObject.token)==='string'?requestProperties.headerObject.token:false;

                    tokenHandler._token.varify(token,checkObject.userPhone,(tokenIsValid)=>{
                        if(tokenIsValid){
                            if(protocol){
                                checkObject.protocol=protocol;
                            }
                            if(url){
                                checkObject.url=url;
                            }
                            if(method){
                                checkObject.method=method;
                            }
                            if(successCodes){
                                checkObject.successCodes=successCodes;
                            }
                            if(protocol){
                                checkObject.timeoutSeconds=timeoutSeconds;
                            }


                            data.update('checks',id, checkObject,(err2)=>{
                                if(!err2){
                                    callback(200);
                                }else{
                                    callback(500,{
                                        error:"There was a server side error!"
                                    })
                                }
                            })
                        }else{
                            callback(403,{'error':'Authentication Error!'});
                        }
                    })
                }else{
                    callback(500,{'error':'There was a problem in the server side!'});
                }
            })
        }else{
            callback(404,{'error':'You must provide atleast one field to update!'});
        }
    }else{
        callback(404,{'error':'You have a problem in your request!'});
    }
}

//@TODO: Authentication
handler._check.delete=(requestProperties,callback)=>{
    const id=typeof(requestProperties.queryStringObject.id)==='string'&& requestProperties.queryStringObject.id.trim().
    length==20?requestProperties.queryStringObject.id:false;

    if(id){
        //lookup the check
        data.read('checks',id ,(err1,checkData)=>{
            if(!err1 && checkData){
                let token=typeof(requestProperties.headerObject.token)==='string'?requestProperties.headerObject.token:false;
                tokenHandler._token.varify(token,parseJSON(checkData).userPhone,(tokenIsValid)=>{
                    if(tokenIsValid){
                        //delete the check data
                        data.delete('checks',id,(err2)=>{
                            if(!err2){
                                data.read('users',parseJSON(checkData).userPhone,(err3,userData)=>{
                                    let userObject=parseJSON(userData);
                                    if(!err3&& userData){
                                        
                                        let userChecks=typeof(userObject.checks)==='object'&&
                                        userObject.checks instanceof Array?userObject.checks:[];

                                        //remove the deleted the check id from users list of checks
                                        let checkPosition=userChecks.indexOf(id);
                                        if(checkPosition>-1){
                                            //for delete something we use splice
                                            userChecks.splice(checkPosition,1);

                                            //resave the users
                                            userObject.checks=userChecks;
                                            data.update('users',userObject.phone,userObject,(err4)=>{
                                                if(!err4){
                                                    callback(200);
                                                }else{
                                                    callback(500,{
                                                        error:"There was a server side problem"
                                                    });
                                                }
                                            })
                                        }else{
                                            callback(500,{
                                                error:"The check id that you are trying to remove is not found in user!"
                                            });
                                        }
                                    }
                                    else{
                                        callback(500,{
                                            error:"There was a server side problem"
                                        });
                                    }
                                })
                            }else{
                                callback(500,{
                                    error:"There was a server side problem"
                                })
                            }
                        })
                    }
                    else{
                        callback(403,{
                            error:'Authentication problem!',
                        });
                    }
                });
            }else{
                callback(404,{'error':'You have a problem in your request!'});
            }
        })
    }else{
        callback(404,{'error':'You have a problem in your request!'});
    }
}

module.exports=handler;