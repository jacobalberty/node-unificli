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
            method: 'unifi',
            options: {
                baseUrl: 'https://unifi:8443',
                username: 'admin',
                password: 'changeme',
            },
            site: 'default'
        };
    }

    validate(oldConf, false);

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
            rl.question(`Username (${oldConf.options.username}): `, (username) => {
                callback();
                if (username !== '')
                    oldConf.options.username = username;
            });
        },
        (callback) => {
            muteableStdout.muted = true;
            process.stdout.write(`Password: `);
            rl.question(``, (password) => {
                console.log();
                muteableStdout.muted = false;
                if (password !== '')
                    oldConf.options.password = password;
                callback();
            });
        },
        (callback) => {
            rl.question(`BaseUrl (${oldConf.options.baseUrl}): `, (baseUrl) => {
                if (baseUrl !== '')
                    oldConf.options.baseUrl = baseUrl;
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
function validate(conf, warn = true) {
    if (conf.options === undefined) {
        if (warn) {
            console.log('Using old configuration format, please run `unificli setup` to update your configuration format');
        }
        conf.method = 'unifi';
        conf.options = {
            baseUrl: `https://${conf.addr}:${conf.port}`,
            username: conf.username,
            password: conf.password
        }
        delete conf.addr;
        delete conf.port;
        delete conf.username;
        delete conf.password;
    }
}

module.exports = { func: setup, validate: validate };
