'use strict'

const argv = require('yargs')
    .usage('Usage: $0 -environment [string]')
    .demandOption(['environment'])
    .argv;
    
module.exports = argv;