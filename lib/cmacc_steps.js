const url = require('path');
const expect = require('chai').expect;
const cmacc = require('cmacc-compiler');

global.fs = require('fs');
global.fetch = require('node-fetch');

const opts = {
  base: __dirname
};

// Helpers

// Traverse the AST over the calls in the variable and return the deepest nested
// sub-tree and the last call of the variable.
// Raises an error if the AST does not contain the variable.
const traverseAST = (ast, variable) => {
  let vars = variable.split('.');
  let calls = vars.slice(0, -1);
  let nestedTree = ast;
  let lastCall = vars[vars.length - 1];
  let covered = [];

  calls.forEach(call => {
    covered.push(call);
    if (nestedTree[call] === undefined) {
      throw new Error(`The variable does not exist: ${covered.join('.')}`);
    }
    nestedTree = nestedTree[call];
  });

  if (typeof nestedTree[lastCall] === 'object') {
    throw new Error(`The variable does not refer to a value in the document, but an object: ${variable}`);
  }

  return [nestedTree, lastCall];
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
    let [nestedTree, lastCall] = traverseAST(this.ast, variable);
    nestedTree[lastCall] = value;
  });

  this.Then('the value of {string} is {string}', (variable, expected) => {
    let [nestedTree, lastCall] = traverseAST(this.ast, variable);
    expect(nestedTree[lastCall]).to.equal(expected);
  });

  this.Then(/^(?:it|the document|the contract|the file) contains the following variables and values:$/, data => {
    let expectedTable = data.rawTable;
    let actualTable = expectedTable.map(pair => {
      let [nestedTree, lastCall] = traverseAST(this.ast, pair[0]);
      return [pair[0], nestedTree[lastCall]];
    });

    expect(actualTable).to.eql(expectedTable);
  });

  this.Then(/^I( don't)? (?:do )?see "([^"]+)"(?: in the (?:document|contract|file))?$/, (negation, expected) => {
    if (negation) {
      expect(this.html).to.not.include(expected);
    } else {
      expect(this.html).to.include(expected);
    }
  });
};
