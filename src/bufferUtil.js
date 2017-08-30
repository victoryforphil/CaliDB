var Buffer = require("buffer").Buffer;

module.exports.CalculateIndex = function(size,value){
    var valueBuffer = Buffer.from(JSON.stringify(value));
    var offset = valueBuffer.length;
    delete valueBuffer;

    return [size, offset]
}

module.exports.GenerateWriteBuffer = function(value){
    return Buffer(JSON.stringify(value));
}