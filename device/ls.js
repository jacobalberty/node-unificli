'use strict';
const columnify = require('columnify')
    , accessDevice = require('node-unifi-settings').accessDevice;

var deps = { };

var columns = {
    _: {
        name: 'name',
        ip: 'ip',
        mac: 'mac',
        model: 'model',
        version: 'version'
    },
    'ugw,usw': {
        'data down': 'txstat',
        'data up': 'rxstat'
    },
    uap: {
        clients: 'num_sta',
        channel: 'channel',
    },
    all: {
        uptime: 'uptime'
    }
}

function listAccessDevices(called, args) {
    var controller = deps.controller;
    var config = deps.config;

    var type = 'all';
    var coltype=type;
    if (args.type) {
        type = args.type;
        switch(type) {
            case 'usw':
            case 'ugw':
            case 'ugw,usw':
            case 'usw,ugw':
                coltype='ugw,usw';
                break;
        default:
            coltype=type;
        }
    }
    var filtype = type;
    var fcol = { };
    Object.assign(fcol, columns._, columns[coltype])

    controller.getAccessDevices('default', function(error, data) {
        if (error)
            throw error;
        var devices = data[0];
        var output = [ ];
        var devObjs = [ ];
        for(key in devices) {
            var dev = new accessDevice(devices[key]);

            dev.human = (args.human !== 'false');

            if (filtype !== 'all') {
                var types = filtype.split(',');
                if (types.indexOf(dev.type) === -1)
                   continue;
            }

            var tmp = { };
            Object.keys(fcol).forEach(function(key, index) {
                if (dev[fcol[key]]) {
                    tmp[key] = dev[fcol[key]];
                }
            });
            output.push(tmp)

        }
        console.log(columnify(output));
    });
}

module.exports = {
    login: true,
    func: listAccessDevices,
    deps: deps
}
