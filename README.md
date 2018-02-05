# node-unificli
Set of command line tools to control a UniFi controller via api

## Installation
You can install with
```sh
npm install -g https://github.com/jacobalberty/node-unificli.git
```
You'll need to copy config.sample.json to ~/.unificli.json and edit to suit your setup

Then simply use the `unificli` command.

## Supported action
Right now poe is the only action available

### `unificli poe`
This action takes 3 parameters. Switch mac address, port number and poe mode.
Poe mode can be `off`, `passv24` or `auto`
`off` is no poe, `passv24` is passive 24 volt poe and `auto` is 802.3af
