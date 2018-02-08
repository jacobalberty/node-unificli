'use strict';
const accessDevice = require("node-unifi-settings").accessDevice;

var deps = { }

function setPoeMode(called, args) {
    var controller = deps.controller;
    var config = deps.config;
    var devCalled = (args.mac !== undefined);

    if (args._.length !== (devCalled ? 2 : 3)) {
        if (devCalled) {
            console.log (`usage: ${called} poe <switch port> <poe mode>`);
        } else {
            console.log (`usage: ${called} poe <switch mac> <switch port> <poe mode>`);
        }
        return;
    }

    var mac = devCalled ? args.mac : args._.splice(0, 1)[0];
    var port = args._.splice(0, 1)[0];
    var mode = args._.splice(0, 1)[0];

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


