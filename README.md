# cmacc-cucumber
Cucumber steps for testing CMACC documents

## install cucumber
The project requires CucumberJS: https://github.com/cucumber/cucumber-js

## install steps
npm install --save-dev cmacc-cucumber

Add the following to a file in your cucumber load path (e.g. in features/support/load.js):
```
const cucumber = require('cucumber');
require('cmacc-cucumber').call(cucumber);
```

This ensures the steps are loaded into the project's Cucumber context and allow
for adding and modifying steps.
