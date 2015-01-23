var express = require('express');
var path = require('path');

var workingDir = process.cwd();
//var favicon = require('serve-favicon');
var config = require(path.normalize(workingDir + '/config.json'));

var appConfig = {
    server: express(),
    baseDir: config.homeDir || __dirname,
    config: config,
    /** @property {NodeJs.fs} */
    file: require('fs'),
    path: path
};

//app.server.use(favicon(__dirname + '/public/favicon.ico'));

var noop = function () {};
var writeFn = function (path) {
    if (config.silent){
        return noop;
    }

    return function () {
        app.file.writeFileSync(path, [].join.call(arguments, "\r\n - "));
    }
};
if (config.writeLogs) {
    console.log = writeFn(config.writeLogs)
}
else if (config.hideLogs) {
    console.log = noop;
}
if (config.writeWarnings) {
    console.warn = writeFn(config.writeWarnings)
}
else if (config.hideWarnings) {
    console.warn = noop;
}
if (config.writeErrors) {
    console.error = writeFn(config.writeErrors)
}
else if (config.hideErrors) {
    console.error = noop;
}


var proxyName="";
var portConfig = config.portConfig || [
    {listenPort: "8080"}
];
portConfig.forEach(function (port) {
    appConfig.server.listen(port.listenPort);
    proxyName = port.proxyName || ("http://localhost:" + port.listenPort + "/");

    console.log("Server Listening On Port: ", port);
});
appConfig.proxyName = proxyName;

var scriptRoot = config.scriptRoot || (workingDir + "/scripts");

dojoConfig = {
    async: 1, // We want to make sure we are using the "modern" loader
    hasCache: {
        "dom": 1 // Ensure that none of the code assumes we have a DOM
    },
    // While it is possible to use config-tlmSiblingOfDojo to tell the
    // loader that your packages share the same root path as the loader,
    // this really isn't always a good idea and it is better to be
    // explicit about our package map.
    packages: appConfig.file.readdirSync(scriptRoot).filter(function (file) {
        return appConfig.file.statSync(scriptRoot + '/' + file).isDirectory();
    }).map(function (file) {
        return {
            name: file,
            location: path.relative(scriptRoot, workingDir) + "/" + file
        }
    })
};

var dojoPath = scriptRoot + '/dojo/dojo.js';

dojoConfig.packages.push({
    name: "logic",
    location: path.relative(workingDir + config.logicPath, dojoPath)
});

require(dojoPath);//setup dojo

global.require([
    'core/app/cache',
    "dojo/aspect",
    "dojo/_base/Deferred",
    "dojo/when"
], function (cache, aspect, Promise, when) {//start the app
    //necessary for jsonld so that it doesn't think this is node.js running.
    process.versions.node = null;

    global.Promise = Promise;//needed for jsonld line 990.
    //format function tries to make the print to the file more like console.log.

    var started = when(cache.create("service/Application", appConfig), function(instance){
        return instance.start(appConfig);//pass in the express app so that we can build upon it.
    });

    appConfig.server.use(function (req, res, next) {
        when(started, function () {
            next();
        });
    });
});

module.exports = appConfig;