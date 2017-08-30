var fs = require('fs');
var BufferUtil = require("./src/bufferUtil")
class CaliDB{
    constructor(config){
        this.currentOffset = 0;
        this.index = {};
        this.fd =  fs.openSync("./db/data.db", 'a');
    }


    Insert(key, value){
       
        var index = this._genIndex(key, value);
        this._writeToDB(index, value);
        
    }

    _genIndex(key, value){
        var indexArray = BufferUtil.CalculateIndex(this.currentOffset, value);
        this.index[key] = indexArray;
        this.currentOffset += indexArray[1];
        this._saveIndex();
        
        return indexArray;
    }
    _saveIndex(){
        var toWrite = "";
        var index = fs.readFileSync("./db/index.db").toString();
        for (var key in this.index) {
            
            if(index.indexOf(key) != -1){
               
            }else{
                toWrite += key + " " + this.index[key] + "\n";
            }
        }
        
      
        fs.appendFileSync("./db/index.db", toWrite, function(err){
            if(err){throw err;}
        });
        this.index={}
    }

    _getIndex(search){
        return new Promise(function(res, rej){
            fs.readFile("./db/index.db",function(err,data){
                var indexies = data.toString().split("\n")
                
                for (var i = 0; i < indexies.length; i++) {
                    var element = indexies[i];
                    if(element ==""){return}
                    var key = element.substring(0, element.indexOf(" "));

                    var index = element.substring( element.indexOf(" ") + 1);
                    index = index.split(",");
                    index[0] = parseInt(index[0])
                    index[1] = parseInt(index[1])
                    if(key == search){
                        res(index);
                        return;
                    }
                   
                }
            });
            
        })
    }
        
    _writeToDB(indexArray, value){
        var writeBuffer = BufferUtil.GenerateWriteBuffer(value);
        
        

        fs.write(this.fd, writeBuffer,0,writeBuffer.length,indexArray[0], function(err, written, buffer){
            if(err){console.error(err)}
           
        });
       
      
        
    }

    GetValue(key){
        var self = this;
        return new Promise(function(res, rej){
            self._getIndex(key).then(function(indexArray){
                console.log(indexArray)
                var fileDescriptor = fs.openSync("./db/data.db", 'r');
                var stats = fs.statSync("./db/data.db")
        
                var readBuffer = Buffer.alloc(indexArray[1]);
                fs.readSync(fileDescriptor,readBuffer, 0,indexArray[1],indexArray[0])
                fs.closeSync(fileDescriptor);
                res( JSON.parse(readBuffer.toString()))
            });
        })
        
        

        
       
    }

    _updateDBSize(){
        var stats = fs.statSync("./db/data.db")
        this.currentOffset = stats.size

    }

    
}

module.exports = CaliDB;