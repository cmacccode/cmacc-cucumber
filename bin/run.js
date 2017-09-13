#! /usr/bin/env node
const path = require('path');
const cucumber = require('cucumber');
const cmaccCucumber = require('../index');

//require('../index').call(cucumber);

const cwd = process.cwd();

const cli = new cucumber.Cli({
  argv: process.argv,
  cwd,
  stdout: process.stdout
});

cli.run()
