/*
*Title: Token Handler
*Description: Handler to handle token related routes
*Author: Nahid Hasan
*Date: Jul 16, 2024
*/

//dependencies
const data=require('../../lib/data');

const {hash}=require('../../helpers/utilities');

const {createRandomString}=require('../../helpers/utilities');

const {parseJSON}=require('../../helpers/utilities');


//module scaffolding
const handler={};

handler.tokenHandler=(requestProperties,callback)=>{
     
    //Checking is it get,post,put or delete
    const acceptedMethods=['get','post','put','delete'];
    if(acceptedMethods.indexOf(requestProperties.method)>-1){
        handler._token[requestProperties.method](requestProperties,callback);
    }
    else{
        callback(405);
    }
}

//nested module scaffolding
handler._token={}

handler._token.post=(requestProperties,callback)=>{
    const phoneNumber=typeof(requestProperties.body.phone)==='string'&& requestProperties.body.phone.trim().
    length==11?requestProperties.body.phone:false;

    const password=typeof(requestProperties.body.password)==='string'&& requestProperties.body.password.trim().
    length>0?requestProperties.body.password:false;

    if(phoneNumber&&password)
    {
        data.read('users',phoneNumber,(err1,userData)=>{
            let hashedPassword=hash(password);
            if(hashedPassword=== parseJSON(userData).password){
                let tokenId= createRandomString(20);
                let expires=Date.now()+60*60*1000;
                let tokenObject={
                    phoneNumber,
                    'id':tokenId,
                    expires,
                };

                //store the token in database
                data.create('tokens',tokenId,tokenObject,(err2)=>{
                    if(!err2){
                        callback(200,tokenObject);
                    }else{
                        callback(500,{
                            error: 'There was a problem in the server side',
                        })
                    }
                })
            }
            else{
                callback(400,{
                    error:'Password is not valid!',
                })
            }
        })
    }else{
        callback(400,{
            error:'you have a problem in your request',
        });
    }
}

//@TODO: Authentication
handler._token.get=(requestProperties,callback)=>{
    //check the token id if valid
    const id=typeof(requestProperties.queryStringObject.id)==='string'&& requestProperties.queryStringObject.id.trim().
    length==20?requestProperties.queryStringObject.id:false;
    console.log(id);

    if(id){
        data.read('tokens',id,(err1,tokenData)=>{
            //Deep copy of object
            const token={...parseJSON(tokenData)};//... called spread. '...' kore ar ekta file e rakhle hard copy hoy.
            if(!err1&&token){
                callback(200,token);
            }else{
                callback(404,{'error':'Requested token was not found!'});
            }
        })
    }
    else{
        callback(404,{'error':'Requested token not found!'});
    }
}

//@TODO: Authentication
handler._token.put=(requestProperties,callback)=>{
    const id=typeof(requestProperties.body.id)==='string'&& requestProperties.body.id.trim().
    length==20?requestProperties.body.id:false;

    const extend=typeof(requestProperties.body.extend)==='boolean'&& requestProperties.body.extend===true?true:false;

    if(id &&extend){
        data.read('tokens',id,(err1,tokenData)=>{
            let tokenObject=parseJSON(tokenData).expires;
            if(tokenObject>Date.now()){
                tokenObject.expires=Date.now()+60*60*1000;

                data.update('tokens',id,(err2)=>{
                    if(!err2){
                        callback(200);
                    }else{
                        callback(500,{
                            error: 'There was a server side error!',
                        })
                    }
                })
            }else{
                callback(400,{
                    error:'Token already expired'
                })
            }
        });
    }else{
        callback(404,{
            error:'There was a problem in your request'
        })
    }
}

//@TODO: Authentication
handler._token.delete=(requestProperties,callback)=>{
    const id=typeof(requestProperties.queryStringObject.id)==='string'&& requestProperties.queryStringObject.id.trim().
    length==20?requestProperties.queryStringObject.id:false;

    if(id){
        data.read('users',id,(err1,tokenData)=>{
            if(!err1&&tokenData){
                data.delete('users',id,(err2)=>{
                    if(!err2){
                        callback(200,{
                            'message':'User was successfully deleted!'
                        });
                    }else{
                        callback(500,{
                            error:'There was a server side error!'
                        });
                    }
                })
            }
            else{
                callback(500,{
                    'error':'There was a server side error!'
                });
            }
        });
    }
    else{
        callback(400,{
            "Error": "There was a problem in your request!",
        })
    }
}


handler._token.varify=(id,phone,callback)=>{
    data.read('tokens',id,(err1,tokenData)=>{
        if(!err1&&tokenData){
            console.log(parseJSON(tokenData).expires);
            console.log(Date.now());
            if(!parseJSON(tokenData).expires||parseJSON(tokenData).expires>Date.now()){
                callback(true);
            }else{
                callback(false);
            }
        }
        else{
            callback(false);
        }
    })
};

module.exports=handler;