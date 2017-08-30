var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
class CaliDB{
    constructor(config){
        this.index = {};
        this.memDB = {};
        this.memCount = 0;
        this.maxMemCount = 10;
        this.currentIndex = 0;
        this.indexFilePath = "./db/index.db";

        this._readIndex();
    }


    Insert(key, value){
        this.memDB[key] = value;
        this.memCount++;
        //this._updateIndex(key, -1);
        this._shiftMem();
    }

    _shiftMem(){
        if(this.memCount > this.maxMemCount){
            var toShift = this.memCount - this.maxMemCount;
            console.log("Shifting: ",this)
            var currentShift = 0;
            for(var key in this.memDB){
                if(currentShift >= toShift){
                    
                    return;
                }

                toShift++;
                this.currentIndex++;
                this._updateIndex(key, this.currentIndex)
                
                //this._writeToDB(this.index[key], JSON.stringify(this.memDB[key]));

                delete this.memDB[key];
                this.memCount--;

            }
            

            console.log("Post Shift: ",this)
           
        }
    }

    _writeToDB(index, value){
        var IndexData = fs.readFileSync("./db/data.db").toString().split("\n");
        IndexData[index] = value + "\n";
        fs.writeFileSync("./db/data.db", IndexData.toString());
    }

    _readIndex(){
        var rawIndexFile = fs.readFileSync(this.indexFilePath).toString().split("\n");;

        if(rawIndexFile.length == 0){return;}
       
        for (var i = 0; i < rawIndexFile.length; i++) {
            var element = rawIndexFile[i];
            var key = element.substring(0, element.indexOf(" "));
            if(!key){return;}
            var index = element.substring( element.indexOf(" ")+1);
            index = parseInt(index);
            if(index != -1){
                this.currentIndex++;
            }
            this.index[key] = index;

        }
        console.log("Current Index: "+ this.currentIndex);
      
    }
    _updateIndex(key, index){
        
        console.log(key + "-"+index)
        this.index[key] = index;
        var writeData = "";
        for (var keyVal in this.index) {
           
            writeData += keyVal + ' ' + this.index[key] + "\n"
        }
        
        fs.writeFileSync(this.indexFilePath, writeData);
    }

    
}

module.exports = CaliDB;