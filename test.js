var CaliDB = require('./index.js');

var DB = new CaliDB();

for(var i=0;i<50;i++){
    DB.Insert("TestKey"+i, {a:1,b:2,c:3});
}
