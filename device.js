'use strict';

var deps = { }

const macactions = {
    poe: "./poe_mode"
};

const actions = {
    ls: "./device/ls"
}

var activeactions;

function deviceRelay(called, argv) {
    var action = argv._.splice(0, 1)[0]
    called += ' device';
    if (isMac(action)) {
        called += ` ${action}`
        argv.mac = action;
        action = argv._.splice(0, 1)[0]
        activeactions = macactions;
        doAction(action, called, argv);
        return
    }
    activeactions = actions;
    doAction(action, called, argv);
}

function showHelp() {
}

function isMac(action) {
    if (action !== undefined
        && action.length == 17
        && action.split(':').length == 6
        ) {
        return true;
    }
    return false;
}

function doAction(action, called, argv) {
    if (activeactions[action] === undefined) {
        console.log(`Usage: device <action>`);
        console.log(`Usage: device <mac address> <action>`);
        console.log(`Supported actions: ${Object.keys(actions).join(', ')}`);
        console.log(`Supported MAC address actions: ${Object.keys(macactions).join(', ')}`);
        return;
    }
    activeactions[action] = require(activeactions[action]);
    if(activeactions[action].deps !== undefined) {
        Object.assign(activeactions[action].deps, deps);
    }
    activeactions[action].func(called, argv);
}

function doMACAction(action, called, argv) {
}

module.exports = {
    login: true,
    func: deviceRelay,
    deps: deps
}
