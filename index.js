var fs = require('fs');
var mkdirp  = require('mkdirp');
var BufferUtil = require("./src/bufferUtil")
class CaliDB {
    constructor(config = {}) {

        this.path = config.path || "./db/";
        this.currentOffset = 0;
        this.index = {};
        this._pathCheck(this.path);
        this.fd = fs.openSync(this.path + "data.db", 'a');

    }


    Set(key, value) {
        var index = this._genIndex(key, value);
        this._writeToDB(index, value);
    }

    Get(key) {
        var self = this;
        return new Promise(function (res, rej) {
            self._getIndex(key).then(function (indexArray) {

                var fileDescriptor = fs.openSync(self.path + "data.db", 'r');
                var stats = fs.statSync(self.path + "data.db")

                var readBuffer = Buffer.alloc(indexArray[1]);
                fs.readSync(fileDescriptor, readBuffer, 0, indexArray[1], indexArray[0])
                fs.closeSync(fileDescriptor);
                res(JSON.parse(readBuffer.toString()))
            });
        })
    }

    GetSync(key) {
        var self = this;
        var indexArray = self._getIndexSync(key)

        var fileDescriptor = fs.openSync(self.path + "data.db", 'r');
        var stats = fs.statSync(self.path + "data.db")

        var readBuffer = Buffer.alloc(indexArray[1]);
        fs.readSync(fileDescriptor, readBuffer, 0, indexArray[1], indexArray[0])
        fs.closeSync(fileDescriptor);
        return JSON.parse(readBuffer.toString());
    }
    // PRIVATE FUNCTIONS

    _pathCheck(path) {
        try {
            fs.statSync(path)
        } catch (err) {
            mkdirp.sync(path)
            fs.writeFileSync(path + "index.db", "");
        }
    }

    _genIndex(key, value) {
        var indexArray = BufferUtil.CalculateIndex(this.currentOffset, value);
        this.index[key] = indexArray;
        this.currentOffset += indexArray[1];
        this._saveIndex();

        return indexArray;
    }
    _saveIndex() {
        var toWrite = "";
        var index = fs.readFileSync(this.path + "index.db").toString();
        for (var key in this.index) {

            if (index.indexOf(key) != -1) {

            } else {
                toWrite += key + " " + this.index[key] + "\n";
            }
        }


        fs.appendFileSync(this.path + "index.db", toWrite, function (err) {
            if (err) { throw err; }
        });
        this.index = {}
    }

    _getIndex(search) {
        var self = this;
        return new Promise(function (res, rej) {
            fs.readFile(self.path + "index.db", function (err, data) {
                var indexies = data.toString().split("\n")

                for (var i = 0; i < indexies.length; i++) {
                    var element = indexies[i];
                    if (element == "") { return }
                    var key = element.substring(0, element.indexOf(" "));

                    var index = element.substring(element.indexOf(" ") + 1);
                    index = index.split(",");
                    index[0] = parseInt(index[0])
                    index[1] = parseInt(index[1])
                    if (key == search) {
                        res(index);
                        return;
                    }

                }
            });

        })
    }

    _getIndexSync(search) {
        var self = this;
        var data = fs.readFileSync(self.path + "index.db");
        var indexies = data.toString().split("\n")

    
        for (var i = 0; i < indexies.length; i++) {
            var element = indexies[i];
            if (element == "") { return }
            var key = element.substring(0, element.indexOf(" "));

            var index = element.substring(element.indexOf(" ") + 1);
            index = index.split(",");
            index[0] = parseInt(index[0])
            index[1] = parseInt(index[1])
            if (key == search) {
                return index;
            }

        }
    }

_writeToDB(indexArray, value) {
    var writeBuffer = BufferUtil.GenerateWriteBuffer(value);



    fs.write(this.fd, writeBuffer, 0, writeBuffer.length, indexArray[0], function (err, written, buffer) {
        if (err) { console.error(err) }

    });



}



_updateDBSize() {
    var stats = fs.statSync(this.path + "data.db")
    this.currentOffset = stats.size

}


}

module.exports = CaliDB;