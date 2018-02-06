'use strict';
const accessDevice = require("node-unifi-settings").accessDevice;

var deps = { }

function setPoeMode(called, args) {
    var controller = deps.controller;
    var config = deps.config;

    args = args._; // We don't accept any options so discard them and only deal with the arguments
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

function updateAccessDevice(controller, sites, accessDevice) {
    var changes = accessDevice.getChanges();
    if (Object.keys(changes).length > 0) {
        controller.setDeviceSettingsBase(sites, accessDevice.id, changes);
    }
}

module.exports = {
    login: true,
    func: setPoeMode,
    deps: deps
}


