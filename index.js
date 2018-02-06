#!/usr/bin/env node

const fs = require("fs")
    , os = require("os")
    , unifi = require("node-unifi");

const actions = {
    setup: require("./setup"),
    poe: require("./poe_mode")
}

var called = process.argv.splice(0, process.execArgv.length + 2).join(' ');
var action = process.argv.splice(0, 1)[0];
var argv = require('minimist')(process.argv);

if (actions[action] === undefined) {
    console.log(`Supported actions: ${Object.keys(actions).join(', ')}`);
    return;
}

if (actions[action].login !== true) {
    actions[action].func(called, argv);
    return;
}

const confPaths = [ "config.json", `${os.homedir()}/.unificli.json`, "/etc/unificli/config.json" ]
var filen;
for(key in confPaths) {
    if (fs.existsSync(confPaths[key])) {
        filen = confPaths[key];
        break;
    }
}
if (filen === undefined) {
    console.log("Could not find a configuration file");
    return;
}
try {
    var config = JSON.parse(fs.readFileSync(filen, "utf-8"));
}
catch (err) {
    console.log(`Can't access or parse 'config.json'`);
    return;
}

var controller = new unifi.Controller(config.addr, config.port);

controller.login(config.username, config.password, function(error) {
    if (error)
        throw error;
    if(actions[action].deps !== undefined) {
        Object.assign(actions[action].deps, { config: config, controller: controller });
    }
    actions[action].func(called, argv);
});
