'use strict';
const bytes = require('bytes')
    , columnify = require('columnify')
    , prettyMs = require('pretty-ms');

var deps = { };

var colfuncs = {
    uptime: function (dev) { return prettyMs(dev.uptime); },
    channel: function (dev) {
        var output = [ ];
        if (dev.radio_table_stats) {
            // Controller 5.7.x
            for(key in dev.radio_table_stats) {
                var radio = dev.radio_table_stats[key];
                output.push(`${radio.channel} (${radio.radio})`);
            }
        } else {
            // Works with controller 5.6.x
            if (dev['ng-channel'])
                output.push(`${dev['ng-channel']} (2.4ghz)`);
            if (dev['na-channel'])
                output.push(`${dev['na-channel']} (5ghz)`);
        }
        return output.join(', ');
    },
    rxstat: function(dev) { return bytes(dev.rx_bytes) },
    txstat: function(dev) { return bytes(dev.tx_bytes) }
}

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
                var value;
                if (colfuncs[fcol[key]] !== undefined) {
                    value = colfuncs[fcol[key]](dev);
                } else {
                    value = dev[fcol[key]];
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
    func: listAccessDevices,
    deps: deps
}
