const fs = require("fs")
    , os = require("os")
    , readline = require("readline")
    , Writable = require('stream').Writable
    , async = require("async");

function setup(called, args) {
    var filen=`${os.homedir()}/.unificli.json`;
    var oldConf;
    try {
        oldConf = JSON.parse(fs.readFileSync(filen, "utf-8"));
    } catch (err) { // just discard errors and make a blank object because we want to make a new file anyway
        oldConf = {
            username: 'admin',
            password: 'changeme',
            addr: 'unifi',
            port: '8443',
            site: 'default'
        };
    }
    var readline = require('readline');

    var muteableStdout = new Writable({
        write: function(chunk, encoding, callback) {
        if (!this.muted)
            process.stdout.write(chunk, encoding);
        callback();
        }
    });

    muteableStdout.muted = false;

    var rl = readline.createInterface({
        input: process.stdin,
        output: muteableStdout,
        terminal: true
    });

    async.series([
        (callback) => {
            rl.question(`Username (${oldConf.username}): `, (username) => {
                callback();
                if (username !== '')
                    oldConf.username = username;
            });
        },
        (callback) => {
            muteableStdout.muted = true;
            process.stdout.write(`Password: `);
            rl.question(``, (password) => {
                console.log();
                muteableStdout.muted = false;
                if (password !== '')
                    oldConf.password = password;
                callback();
            });
        },
        (callback) => {
            rl.question(`Address (${oldConf.addr}): `, (addr) => {
                if (addr !== '')
                    oldConf.addr = addr;
                callback();
            });
        },
        (callback) => {
            rl.question(`Port (${oldConf.port}): `, (port) => {
                if (port !== '')
                    oldConf.port = port;
                callback();
            });
        },
        (callback) => {
            rl.question(`Site (${oldConf.site}): `, (site) => {
                if (site !== '')
                    oldConf.site = site;
                callback();
            });
        },
    ], () => {
        fs.writeFileSync(filen, JSON.stringify(oldConf, null, ' '), 'utf-8')
        rl.close();
    });
}

module.exports = { func: setup };
