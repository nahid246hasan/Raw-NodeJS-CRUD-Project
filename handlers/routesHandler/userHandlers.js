/*
*Title: User Handler
*Description: Handler to handle user related routes
*Author: Nahid Hasan
*Date: Jul 8, 2024
*/

//dependencies
const data=require('../../lib/data');

const {hash}=require('../../helpers/utilities');

const {parseJSON}=require('../../helpers/utilities');

const tokenHandler=require('../../handlers/routesHandler/tokenHandler');


//module scaffolding
const handler={};

handler.userHandler=(requestProperties,callback)=>{
     
    //Checking is it get,post,put or delete
    const acceptedMethods=['get','post','put','delete'];
    if(acceptedMethods.indexOf(requestProperties.method)>-1){
        handler._users[requestProperties.method](requestProperties,callback);
    }
    else{
        callback(405);
    }
}

//nested module scaffolding
handler._users={}

handler._users.post=(requestProperties,callback)=>{
    const firstName=typeof(requestProperties.body.firstName)==='string'&& requestProperties.body.firstName.trim().
    length>0?requestProperties.body.firstName:false;

    const lastName=typeof(requestProperties.body.lastName)==='string'&& requestProperties.body.lastName.trim().
    length>0?requestProperties.body.lastName:false;

    const phoneNumber=typeof(requestProperties.body.phone)==='string'&& requestProperties.body.phone.trim().
    length==11?requestProperties.body.phone:false;

    const password=typeof(requestProperties.body.password)==='string'&& requestProperties.body.password.trim().
    length>0?requestProperties.body.password:false;

    const tosAgreement=typeof(requestProperties.body.tosAgreement)==='boolean'?requestProperties.body.tosAgreement:false;

    if(firstName&&lastName&&phoneNumber&&password&&tosAgreement){
        //make sure that user does not exists
        data.read('users',phoneNumber,(err1)=>{
            
            if(err1){
                let userObject={
                    //basically (firstName: firstName) evabe likhte hoy. but duita same hole firstName lekha jay
                    firstName,
                    lastName,
                    phoneNumber,
                    password:hash(password),
                    tosAgreement,
                };
                //store the user to db
                data.create('users',phoneNumber,userObject,(err2)=>{
                    if(!err2){
                        
                        callback(200,{
                            message: 'User was created successfully!',
                        });
                    }
                    else{
                        callback(500,{
                            error: 'Could not create user!'
                        });
                    }
                })
            }
            else{
                callback(500,{
                    error:'There was a problem in server side'
                })
            }
        });
    }
    else{
        callback(400,{
            error: 'you have a problem in your request'
        })
    }
}

//@TODO: Authentication
handler._users.get=(requestProperties,callback)=>{

    //check the phone number if valid
    const phoneNumber=typeof(requestProperties.queryStringObject.phone)==='string'&& requestProperties.queryStringObject.phone.trim().
    length==11?requestProperties.queryStringObject.phone:false;
    if(phoneNumber){

        //varify token
        let token=typeof(requestProperties.headerObject.token)==='string'?requestProperties.headerObject.token:false;

        tokenHandler._token.varify(token,phoneNumber,(tokenId)=>{
            if(tokenId){
                //token is valid
                data.read('users',phoneNumber,(err,u)=>{
                    //Deep copy of object
                    const user={...parseJSON(u)};//... called spread. '...' kore ar ekta file e rakhle hard copy hoy.
                    if(!err&&user){
                        delete user.password;
                        console.log(user);
                        callback(200,user);
                    }else{
                        callback(404,{'error':'Requested user was not found!'});
                    }
                })
            }
            else{
                callback(403,{'error':'Authentication failed!'})
            }
        });
    }
    else{
        callback(404,{'error':'Requested user not found!'});
    }
}

//@TODO: Authentication
handler._users.put=(requestProperties,callback)=>{
    const firstName=typeof(requestProperties.body.firstName)==='string'&& requestProperties.body.firstName.trim().
    length>0?requestProperties.body.firstName:false;

    const lastName=typeof(requestProperties.body.lastName)==='string'&& requestProperties.body.lastName.trim().
    length>0?requestProperties.body.lastName:false;

    const phoneNumber=typeof(requestProperties.body.phone)==='string'&& requestProperties.body.phone.trim().
    length==11?requestProperties.body.phone:false;

    const password=typeof(requestProperties.body.password)==='string'&& requestProperties.body.password.trim().
    length>0?requestProperties.body.password:false;


    if(phoneNumber){
        if(firstName||lastName||password){
            //find out is the data in our data base?
            data.read('users',phoneNumber,(err1,uData)=>{
                const userData={...parseJSON(uData)};
                if(!err1&&userData){
                    if(firstName){
                        userData.firstName=firstName;
                    }
                    if(lastName){
                        userData.lastName=lastName;
                    }
                    if(password){
                        userData.password=hash(password);
                    }

                    //update or store to database
                    data.update('users',phone,userData,(err2)=>{
                        if(!err2){
                            callback(200,{'message':'User was updated successfully!'});
                        }
                        else{
                            callback(500,{
                                'error': 'There was a problem in the server side',
                            });
                        }
                    })
                }
                else{
                    callback(400,{
                        'error':'You have a problem in your request!',
                    });
                }
            });
        }
        else{
            callback(400,{
                'error':'You have a problem in your request!',
            });
        }
    }
    else{
        callback(400,{
            'error':'Invalid Phone Number. Please try again!'
        });
    }
}

//@TODO: Authentication
handler._users.delete=(requestProperties,callback)=>{
    const phoneNumber=typeof(requestProperties.queryStringObject.phone)==='string'&& requestProperties.queryStringObject.phone.trim().
    length==11?requestProperties.queryStringObject.phone:false;

    if(phoneNumber){
        data.read('users',phoneNumber,(err1,userData)=>{
            if(!err1&&userData){
                data.delete('users',phoneNumber,(err2)=>{
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

module.exports=handler;