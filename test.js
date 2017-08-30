var CaliDB = require('./index.js');

var DB = new CaliDB();

for(var i=0;i<50;i++){
    DB.Insert("TestKey"+i, {a:i,b:i+2,c:i+3});
}

setTimeout(function() {
    DB._getValue("TestKey2");
}, 1000);