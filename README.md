# A BDD integration testing tool with Cucumber.js and Apickli

This is an extended [Apickli](https://github.com/apickli/apickli) and
[Cucumber.js](https://github.com/cucumber/cucumber-js) testing utility
that comes with an Express server rendering a Gherkin editor and runner in your browser.
The feature scripts are executed on the Node.js server to provide maxiumum functionality
and connectivity.

## How to start

We depend on Apickli and Cucumber.js. Thus those dependencies need to be installed first:
```sh
$ npm install
```

You can also consider to install Cucumber.js globally:
```sh
$ npm install -g cucumber
```

In this case, remove the "cucumber" entry from this projects `package.json` file
before installing the dependencies.

### Start new project

Below steps will help you start a new test project from scratch.

#### 1. Folder structure
Let's start a new integration testing project for an API called *myapi*. The folder structure will need to match the structure expected by cucumber.js:

    features/
    ---- myapi.feature
    ---- step_definitions/
    --------- myapi.js
    ---- support/
    --------- myworld.js
Features directory contains cucumber feature files written in gherkin syntax. step_definitions contains the JavaScript implementation of gherkin test cases. Check out the Apickli GitHub repository for example implementations covering most used testing scenarios.

#### 2. Symlink common Apickly step definitions and support files

```sh
$ cd fetures/support
$ ln -s ../../lib/support/world.js
$ cd ../step_definitions
$ ln -s ../../lib/step_definitions/apickli-gherkin.js
```

#### 3. Step definitions for your project

Now we need a step definition file specific for this project, let's call it *myapi.js*:

```js
/* jslint node: true */
'use strict';

// include the extended Apickli library
var apickli = require('../../lib/apickli-ext');

module.exports = function() {
  // cleanup before every scenario
  this.Before(function(callback) {
    this.apickli = new apickli.Apickli('http', 'httpbin.org');
    callback();
  });
};
```

From here on, follow the documentation of either Apickli or Cucumber.js for writing
Gherkin scripts and how to run them.


### Start the visual editor

Besides that the saved fetures can be run via command line, this project also provides
a visual editor to quickly write and run tests in the browser.

First, start the express server:
```sh
$ node server.js
```

Then point your browser to `http://localhost:3000` and start working.


## Disclaimer

This is only a proof-of-concept application and neither fully tested nor reviewed.
Use it at your own risk and DON'T USE IT WITH A PRODUCTIVE ENVIRONMENT!
