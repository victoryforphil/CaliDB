# CaliDB
A local and fast Database solution for NodeJS that allows your to balance between in-memory storage and JSON File based storage based on your requirements and system specs.

## Features 
- Local DB
- Seperate Index
- Does not require DB to be loded into memory
- Balance between File System and Memory storage for the DB (Soon)
- Split DB files to avoid large file size (Soon)
- Query System (Soon)
- Compression/Opimization for Data (Soon)
- In-Memory Optimization (Soon)

## How it works
CaliDB uses an index file and sets of binary DB files. All the "raw" data is stored in the db files and their byte positions are stored in the index, along with their size. This results in not having to load the entire DB like in simpler JSON implementations.

## Example Code
```js   
var CaliDB = require('calidb');
var DB = new CaliDB(config);

DB.Insert("123", {a:1,b:2,c:3});
DB.Insert("letterswork", {a:1,b:2,c:3});
DB.Insert("no_spaces", {a:1,b:2,c:3});

DB.GetValue("letterswork").then(function(data){
    //data = {a:1,b:2,c:3}
})
```

## Config Values
_Still under Construction_

## Docs
_Stil Under Construction_

## Help
_Stil Under Construction_

## ToDo
*See Our Project Panel on Github*
