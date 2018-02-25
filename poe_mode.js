'use strict';
const accessDevice = require("node-unifi-settings").accessDevice;

var deps = { }

function setPoeMode(called, args) {
    var unifi = deps.unifi;
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

    unifi.list_aps(mac, config.site)
        .then(data => {
            var ad = new accessDevice(data.data);
            var portObj = ad.ports(port)
            portObj.poe_mode = mode;
            unifi.netsite('/rest/device/' + ad.id, ad.getChanges(), {}, 'PUT', config.site);
        })
        .catch(err => {throw err});
}

module.exports = {
    login: true,
    func: setPoeMode,
    deps: deps
}


