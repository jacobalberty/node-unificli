'use strict';

var deps = { }

const actions = {
    ls: "./device/ls"
}

function deviceRelay(called, argv) {
    var action = argv._.splice(0, 1)[0]
    called += ' device';
    if (actions[action] === undefined) {
        console.log(`Supported actions: ${Object.keys(actions).join(', ')}`);
        return;
    }
    actions[action] = require(actions[action]);
    if(actions[action].deps !== undefined) {
        Object.assign(actions[action].deps, deps);
    }
    actions[action].func(called, argv);
    return;
}

module.exports = {
    login: true,
    func: deviceRelay,
    deps: deps
}
