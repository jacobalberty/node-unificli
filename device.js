'use strict';
const columnify = require('columnify')
    , prettyMs = require('pretty-ms');

var deps = { };

function setPoeMode(called, args) {
    var controller = deps.controller;
    var config = deps.config;

    var columns = {
        _: {
            name: 'name',
            ip: 'ip',
            mac: 'mac',
            model: 'model',
            version: 'version'
        },
        'ugw,usw': {
        },
        uap: {
            clients: { _: 'num_sta', type: 'ntar', ntar: 'radio_table_stats' },
            channel: { _: 'channel', type: 'ntar', ntar: 'radio_table_stats' }

        },
        all: {
            uptime: { _: 'uptime', type: 'duration' }
        }
    }
    var type = args.type || 'all';
    var fcol = { };
    Object.assign(fcol, columns._, columns[type])

    controller.getAccessDevices('default', function(error, data) {
        if (error)
            throw error;
        var devices = data[0];
        var output = [ ];
        for(key in devices) {
            var dev = devices[key];
            if (type !== 'all') {
                var types = type.split(',');
                if (types.indexOf(dev.type) === -1)
                   continue;
            }
            var tmp = { };
            Object.keys(fcol).forEach(function(key, index) {
                var value = dev[key];
                switch(fcol[key].type) {
                    case 'ntar':
                        // TODO: Go through every entry in the array and join the values
                        value = dev[fcol[key].ntar][0][fcol[key]._];
                        break;
                    case 'duration':
                        value = prettyMs(value);
                        break;
                }
                tmp[key] = value;
            });
            output.push(tmp)
        }
        console.log(columnify(output));
    });
}

module.exports = {
    login: true,
    func: setPoeMode,
    deps: deps
}


