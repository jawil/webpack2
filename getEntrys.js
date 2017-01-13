var path = require('path');
var fs = require('fs');
module.exports =function getEntrys() {
    var matchs;
    var files = {};
    var entry = [];
    var modules = path.resolve(__dirname, './src/modules/');
    var dirs = fs.readdirSync(modules);
    dirs.forEach(function(item, index) {
            var itemPath = path.resolve(modules, item);
            var sta = fs.statSync(itemPath);
            if (sta.isDirectory()) {
                var filesDir = fs.readdirSync(itemPath);
                filesDir.forEach(function(val, index) {
                    matchs = /(.+)\.js$/g.test(val);
                    if (matchs) {
                        var prname = val.split('.')[0];
                        files[prname] = path.resolve(itemPath, val);
                    }
                });
            }
        });
    //console.log(files);
    return files;
};

