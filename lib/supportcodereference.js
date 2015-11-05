'use strict';

var SupportCodeLibrary = function()
  {
  var stepDefinitions = {};
  var self = this;

  function loadFromPaths(paths)
    {
    paths.forEach(function(path)
      {
      var initializer = require(path);
      if (typeof(initializer) === 'function')
        initializer.call(self);
      });
    }

  function getStepDefinitions(keyword)
    {
    return stepDefinitions[keyword] || [];
    }

  function getReferenceSheet()
    {
    var sheet = '', indent = '    ';

    ['Given','When','Then'].forEach(function(keyword)
      {
      var steps = getStepDefinitions(keyword);
      if (steps.length)
        {
        sheet += keyword + '\n';
        for (var i=0; i < steps.length; i++)
          sheet += indent + steps[i] + '\n';
        sheet += '\n';
        }
      });

    return sheet;
    }

  function register(keyword, definition, callback)
    {
    if (stepDefinitions[keyword] === undefined)
        stepDefinitions[keyword] = [];

    definition = definition.toString().replace(/^\/\^?/, '').replace(/\$?\/[a-zA-Z]*$/, '');
    stepDefinitions[keyword].push(definition);
    }

  function __wrap(keyword)
    {
    return function(definition, callback) { return register(keyword, definition, callback); };
    }

  // export methods
  this.loadFromPaths = loadFromPaths;
  this.getReferenceSheet = getReferenceSheet;
  this.getStepDefinitions = getStepDefinitions;

  this.Given = __wrap('Given');
  this.When = __wrap('When');
  this.Then = __wrap('Then');
  this.Before = __wrap('Before');
  this.After = __wrap('After');
  this.Around = __wrap('Around');
  this.setDefaultTimeout = function(){ };
  };

module.exports = {
  Library: SupportCodeLibrary
};
