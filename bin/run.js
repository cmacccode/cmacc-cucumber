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

cli.run()