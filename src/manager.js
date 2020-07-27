#!/usr/bin/env node

// Licensed under Apache Version 2.0
// Please see the LICENSE file in the root directory of the project for more
// information

const path = require('path');
const fs = require('fs');
const {
  exec,
} = require('child_process');

String.prototype.interpolate = function (params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${this}\`;`)(...vals);
};

const args = process.argv.splice(3);
const verbose = (args.includes('-v') || args.includes('-verbose'));
const slient = (args.includes('-s') || args.includes('-silent'));

function execPromise(cmd) {
  if (!slient) {
    if (verbose) {
      cmd.stdout.on('data', (data) => {
        console.log(data);
      });
      cmd.stderr.on('data', (data) => {
        console.log(`err: ${data}`);
      });
    }
    cmd.on('close', (code) => {
      console.log(`exited: '${cmd.spawnargs.slice(2).join(' ')}' with code: ${code}`);
    });
  }
  return new Promise((resolve, reject) => {
    cmd.addListener('error', reject);
    cmd.addListener('exit', resolve);
  });
}

function execCMD(cmd) {
  return execPromise(exec(cmd));
}

async function execScriptCMD(commands, src) {
  for (let command of commands) {
    command = command.interpolate({
      cmdArg: src,
    });
    if (!slient) {
      console.log(`running: ${command}`);
    }
    return execCMD(command);
  }
}

function processCMD(cmd, cmdArgs) {
  execCMD(`if command -v ${cmd} &> /dev/null; then exit 0; else exit 1; fi;`).then(async (resCode) => {
    if (resCode === 0) {
      const cmdWthArgs = `${cmd} install ${cmdArgs}`;
      if (!slient) {
        console.log(`running: ${cmdWthArgs}`);
      }
      return execCMD(cmdWthArgs);
    }
    throw (`${cmd} not found, is it installed?`);
  });
}

function isScript(cmdArgs, cmd) {
  if (cmd === 'script') {
    const cmd = [
      'wget ${cmdArg} -O script.sh',
      'chmod +x ./script.sh',
      './script.sh',
      'rm -f ./script.sh',
    ];
    return execScriptCMD(cmd, cmdArgs);
  }
  return processCMD(cmd, cmdArgs);
}

async function main() {
  if (process.argv[2] === 'install' || process.argv[2] === 'i') {
    for (let i = 0; i < args.length; i++) {
      if (args[i].includes('/')) {
        const cmd = args[i].split('/')[0];
        cmdArgs = args[i].substring(args[i].indexOf('/') + 1);
        if (cmdArgs.includes(',')) {
          for (let a = 0; a < cmdArgs.split(',').length; a++) {
            await isScript(cmdArgs.split(',')[a], cmd);
          }
        } else {
          await isScript(cmdArgs, cmd);
        }
      } else if (!args[i].includes('-')) {
        throw (new Error(`Invalid argument: ${args[i]} missing '/'`));
      }
    }
  } else if (process.argv[2] === 'h' || process.argv[2] === 'help' || process.argv.length === 2) {
    console.log('Usage: mpm [command] [source(s)] [options]' + '\n\n'
    + 'Commands:' + '\n'
    + '  ' + 'i, install: ' + ' ' + 'Installs the items listed in source(s)' + '\n'
    + '  ' + 'h, help:    ' + ' ' + 'Print available command line commands and options (currently set)' + '\n\n'
    + 'Source(s) Format:' + '\n'
    + '  ' + 'One source: command/package:               ' + ' ' + 'Examples: npm/express, rvm/1.9.3' + '\n'
    + '  ' + 'Multiple sources: command/package,package: ' + ' ' + 'Examples: npm/express,axios and apt/mysql-server,mysql-client' + '\n\n'
    + 'Available Options:' + '\n'
    + '  ' + '-s, -silent:      ' + ' ' + 'no logs wil be output, not even error logs' + '\n'
    + '  ' + '-v, -verbose:     ' + ' ' + 'all logs will be output');
  } else {
    console.log(`Command: ${process.argv[2]} not found, please try again with a different command or execute` + '\n'
    + '$ mpm help' + '\n'
    + 'to see a list of commands');
  }
}

main();
