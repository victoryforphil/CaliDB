var fs = require('fs');
var BufferUtil = require("./src/bufferUtil")
class CaliDB{
    constructor(config){
        this.currentOffset = 0;
        this.index = {};
    }


    Insert(key, value){
       
        var index = this._genIndex(key, value);
        this._writeToDB(index, value);
    }

    _genIndex(key, value){
        var indexArray = BufferUtil.CalculateIndex(this.currentOffset, value);
        this.index[key] = indexArray;
        this.currentOffset += indexArray[1];
        return this.index[key];
    }

    _writeToDB(indexArray, value){
        var writeBuffer = BufferUtil.GenerateWriteBuffer(value);
        
        var fileDescriptor = fs.openSync("./db/data.db", 'w', 438);
        console.log(indexArray[0])
        fs.write(fileDescriptor, writeBuffer,0,writeBuffer.length,indexArray[0], function(err, written, buffer){
            console.log(err || "Wrote: " + buffer.length)
        });
        
    }

    _getValue(key){
        var indexArray = this.index[key];


        var fileDescriptor = fs.openSync("./db/data.db", 'r');
        var stats = fs.statSync("./db/data.db")

        var readBuffer = Buffer.alloc(stats.size);
        fs.read(fileDescriptor,readBuffer, 0,indexArray[0],indexArray[1],function(err,read,buffer){
            console.log( "READ: " + read);
            console.log("Buffer: " + readBuffer);

        });
        console.log(readBuffer);
    }

    _updateDBSize(){
        var stats = fs.statSync("./db/data.db")
        this.currentOffset = stats.size

    }

    
}

module.exports = CaliDB;