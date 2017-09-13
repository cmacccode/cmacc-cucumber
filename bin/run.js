#! /usr/bin/env node
const cucumber = require('cucumber');
const cmaccCucumber = require('../index');


const cwd = process.cwd()
const cli = new cucumber.Cli({
  argv: process.argv,
  cwd,
  stdout: process.stdout
});

 cli.run()
