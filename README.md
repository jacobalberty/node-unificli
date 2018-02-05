# node-unificli
Set of command line tools to control a UniFi controller via api

## Installation
You can install and configure with the following two commands:

```sh
npm install -g https://github.com/jacobalberty/node-unificli.git
unificli setup
```


## Supported actions

### `unificli setup`
This action walks you through creating a ~/.unificli.json configuration file

### `unificli poe`
This action takes 3 parameters. Switch mac address, port number and poe mode.
Poe mode can be `off`, `passv24` or `auto`
`off` is no poe, `passv24` is passive 24 volt poe and `auto` is 802.3af

