#! /usr/bin/env node
var path = require('path')
var pkg = require(path.join(process.cwd(), 'package.json'))
var os = require('os')
var platform = os.platform()
var log = console.log

platformArg = process.argv.find(x => /^platform=/.test(x));
if (platformArg) {
    platform = platformArg.split('=')[1];
}

var spawn = require('cross-spawn')

// Build arguments for npm
var dependencies = platform + 'Dependencies'
var dependenciesObj = pkg[dependencies]

if (dependenciesObj && Object.keys(dependenciesObj).length) {
    log('Installing dependencies for ' + platform)
    var npmArgs = ['install']
    // Append any arguments from commandline
    npmArgs = []
    for (var dep in dependenciesObj) {
        if (dependenciesObj.hasOwnProperty(dep)) {
            npmArgs.push(dep.concat('@').concat(dependenciesObj[dep]))
        }
    }
    npmArgs.push('--no-save');

    var options = {
        stdio: 'inherit' // feed all child process logging into parent process
    }

    spawn('npm', npmArgs, options)
} else {
    log('No specific dependencies on this platform: ' + platform)
}
