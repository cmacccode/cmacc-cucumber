const url = require('path');
const expect = require('chai').expect;
const cmacc = require('cmacc-compiler');

global.fs = require('fs');
global.fetch = require('node-fetch');

const opts = {
  base: __dirname
};

// Helpers
// Check if a variable in the given ast has the expected value.
const check_if_equal = (ast, variable, expected) => {
  let actual = ast;
  variable.split('.').forEach(key => (actual = actual[key]));
  expect(actual).to.equal(expected);
};

module.exports = function() {
  this.World = function World() {
    this.ast = undefined;
    this.html = undefined;
  };

  this.Given(/^I compile(?: the)? "([^"]+)"(?: contract| document| file)?$/, contract => {
    const file = url.join('file://', process.cwd(), contract);
    return cmacc.compile(file, opts).then(ast => {
      this.ast = ast;
    });
  });

  this.Given(/^I render the (?:document|contract|file)$/, () => {
    return cmacc
      .render(this.ast)
      .then(x => {
        return cmacc.remarkable.render(x);
      })
      .then(html => {
        this.html = html;
      });
  });

  this.Given('I change {string} to {string}', (variable, value) => {
    let vars = variable.split('.');
    let calls = vars.slice(0, -1);
    let nested = this.ast;
    calls.forEach(key => (nested = nested[key]));
    nested[vars[vars.length - 1]] = value;
  });

  this.Then('the value of {string} is {string}', (variable, expected) => {
    check_if_equal(this.ast, variable, expected);
  });

  this.Then(/^(?:it|the document|the contract|the file) contains the following variables and values:$/, data => {
    let table = data.rawTable;
    table.forEach(pair => {
      check_if_equal(this.ast, pair[0], pair[1]);
    });
  });

  this.Then(/^I( don't)? (?:do )?see "([^"]+)"(?: in the (?:document|contract|file))?$/, (negation, expected) => {
    if (negation) {
      expect(this.html).to.not.include(expected);
    } else {
      expect(this.html).to.include(expected);
    }
  });
};
