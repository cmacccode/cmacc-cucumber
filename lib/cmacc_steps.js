const url = require('path');
const assert = require('assert');
const cmacc = require('cmacc-compiler');

global.fs = require('fs');
global.fetch = require('node-fetch');

const opts = {
  base: __dirname
};

// Helpers
// Check if a variable in the given ast has the expected value.
const check_if_equal = (ast, variable, expected) => {
  actual = ast;
  variable.split('.').forEach(key => (actual = actual[key]));
  assert.equal(actual, expected);
};

module.exports = function() {
  this.World = function World() {
    this.ast = undefined;
    this.html = undefined;
  };

  this.Given('I compile the {string} contract', contract => {
    const file = url.join('file://', process.cwd(), contract);
    return cmacc.compile(file, opts).then(ast => {
      this.ast = ast;
    });
  });

  this.Given('I render the document', () => {
    return cmacc
      .render(this.ast)
      .then(x => {
        return cmacc.remarkable.render(x);
      })
      .then(html => {
        this.html = html;
      });
  });

  this.Then('the value of {string} is {string}', (variable, expected) => {
    check_if_equal(this.ast, variable, expected);
  });

  this.Then('the following variable value pairs exist:', data => {
    let table = data.rawTable.slice(1);
    table.forEach(pair => {
      check_if_equal(this.ast, pair[0], pair[1]);
    });
  });

  this.Then('I see {string} in the document', expected => {
    assert(this.html.includes(expected));
  });
};
