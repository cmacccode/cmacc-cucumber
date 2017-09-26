#! /usr/bin/env node
const path = require('path');
const cucumber = require('cucumber');
const cmaccCucumber = require('../index');

const cwd = process.cwd();

const cli = new cucumber.Cli({
  argv: process.argv.concat('--require', 'node_modules/cmacc-cucumber'),
  cwd,
  stdout: process.stdout
});

let done = false;
cli.run().then(res => (done = true)).catch(err => {
  done = true;
  throw err;
});

function wait() {
  if (!done) setTimeout(wait, 1000);
}
wait();
