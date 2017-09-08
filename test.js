var CaliDB = require('./index.js');
var DLight = require('disnode-lite');

var DB1 = new CaliDB({path:"./db/db-1/"});

for (var index = 0; index < 10000; index++) {
    DB1.Set(index +"key" , index * 10);
    
}
