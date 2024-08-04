/*
*Title: File System
*Description: we are using file system in this project. to handle file system i create this file.
*Author: Nahid Hasan
*Date: Jul 8, 2024
*/
const fs=require('fs');
const path=require('path');

const lib={};

//base directory of the data folder
lib.baseDir=path.join(__dirname,'/../.data/');

//write data to file
lib.create=function(dir,file,data,callback){
    //open file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',(err,fileDescriptor)=>{
        if(!err&&fileDescriptor){
            //convert data to string
            const stringData=JSON.stringify(data);

            //write data to file and close it.
            fs.writeFile(fileDescriptor,stringData,(err2)=>{
                if(!err2){
                    fs.close(fileDescriptor,(err3)=>{
                        if(!err3){
                            callback(false);
                        }
                        else{
                            callback('Error closing the new file.');
                        }
                    });
                }
                else{
                    callback('Error writing to new file.')
                }
            })
        }
        else{
            callback(`${err}`);
        }
    })
}

//read data from file
lib.read=(dir,file,callback)=>{
    
    fs.readFile(`${lib.baseDir+dir}/${file}.json`,'utf8',(err,data)=>
        {
            console.log (err);
            callback(err,data);
        });
};

//update existing file
lib.update=(dir,file,data,callback)=>{
    //file open for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',(err,fileDescriptor)=>{
        if(!err&&fileDescriptor){
            //Convert the data to string
            const stringData=JSON.stringify(data);

            //now we have to empty existing file
            fs.ftruncate(fileDescriptor,(err1)=>{
                if(!err1){
                    //write data to the file and close
                    fs.writeFile(fileDescriptor,stringData,(err2)=>{
                        if(!err2){
                            //close the file
                            fs.close(fileDescriptor,(err3)=>{
                                if(!err3){
                                    callback(false);
                                }
                                else{
                                    callback(`Error closing file`);
                                }
                            })
                        }
                        else{
                            callback('Error writing to file!')
                        }
                    });
                }
                else{
                    console.log("Error truncating file");
                }
            });
        }

        else{
            console.log(`Error updating. File name is not exist`);
        }
    });
};

//delete existing file
lib.delete=(dir,file,callback)=>{
    //unlink file
    fs.unlink(`${lib.baseDir+dir}/${file}.json`,(err)=>{
        if(!err){
            callback(false);
        }
        else{
            callback(`Error Deleting File!`);
        }
    });
};

module.exports=lib;