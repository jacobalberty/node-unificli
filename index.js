#!/usr/bin/env node

const fs = require("fs")
    , os = require("os")
    , unifi = require("node-unifi")
    , accessDevice = require("node-unifi-settings").accessDevice;

const actions = {
    setup: require("./setup"),
    poe: {
        login: true,
        func: setPoeMode
    }
}

var called = process.argv.splice(0, process.execArgv.length + 2).join(' ');
var action = process.argv.splice(0, 1)[0];

if (actions[action] === undefined) {
    console.log(`Supported actions: ${Object.keys(actions).join(', ')}`);
    return;
}

if (actions[action].login !== true) {
    actions[action].func(called, process.argv);
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
    actions[action].func(called, process.argv);
});

function updateAccessDevice(controller, sites, accessDevice) {
    var changes = accessDevice.getChanges();
    if (Object.keys(changes).length > 0) {
        controller.setDeviceSettingsBase(sites, accessDevice.id, changes);
    }
}

function setPoeMode(called, args) {
    if (args.length !== 3) {
        console.log (`usage: ${called} poe <switch mac> <switch port> <poe mode>`);
        return;
    }
    var mac = args[0];
    var port = args[1];
    var mode = args[2];
    controller.getAccessDevices('default', function(error, data) {
        if (error)
            throw error;
        var ad = new accessDevice(data);
        var portObj = ad.ports(port)
        portObj.poe_mode = mode;

        updateAccessDevice(controller, config.site, ad);
    }, mac);
}
