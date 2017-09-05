var CaliDB = require('./index.js');
var DLight = require('disnode-lite');

var DB1 = new CaliDB({path:"./db-1/"});
var DB2 = new CaliDB({path:"./db-2/"});

DB1.Set("key1", "Value1");
DB2.Set("key2", "Value12");

console.log(DB2.GetSync("key2"));