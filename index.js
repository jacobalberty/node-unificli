#!/usr/bin/env node

const fs = require("fs")
    , os = require("os")
    , unifi = require("node-unifiapi");

const actions = {
    device: "./device",
    setup: require("./setup"),
    poe: "./poe_mode"
}

var called = process.argv.splice(0, process.execArgv.length + 2).slice(-1)[0];
var action = process.argv.splice(0, 1)[0];
var argv = require('minimist')(process.argv);

switch (typeof actions[action]) {
    case 'undefined':
        console.log(`Supported actions: ${Object.keys(actions).join(', ')}`);
        return;
    case 'string':
        actions[action] = require(actions[action]);
        break;
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
    actions.setup.validate(config);
}
catch (err) {
    console.log(`Can't access or parse 'config.json'`);
    return;
}

var r = unifi(config.options);

if(actions[action].deps !== undefined) {
    Object.assign(actions[action].deps, { config: config, unifi: r });
}
actions[action].func(called, argv);
