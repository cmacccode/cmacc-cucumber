const url = require('path');
const assert = require('assert');
const cmacc = require('cmacc-compiler');

global.fs = require('fs');
global.fetch = require('node-fetch');

const opts = {
  base: __dirname
};

module.exports = function() {
  this.World = function World() {
    this.ast = undefined;
  };

  this.Given('I compile the {string} contract', contract => {
    const file = url.join('file://', process.cwd(), contract);
    return cmacc.compile(file, opts).then(ast => {
      this.ast = ast;
      return Promise.resolve(ast);
    });
  });

  this.Then('the value of {string} is {string}', (variable, expected) => {
    actual = this.ast;
    variable.split('.').forEach(key => (actual = actual[key]));
    assert.equal(actual, expected);
  });
};
