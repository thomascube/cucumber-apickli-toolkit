'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var Cucumber = require('cucumber');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json

app.get('/', function(req, res)
  {
  res.append('Content-Type', 'text/html');
  res.sendFile('./client/index.html');
  });

app.get('/reference', function(req, res)
  {
  // collect all step definitions from support code files
  var argumentParser = Cucumber.Cli.ArgumentParser([]);
  argumentParser.parse();

  var supportCodeLoader = Cucumber.Cli.SupportCodeLoader(
    argumentParser.getSupportCodeFilePaths(),
    argumentParser.getCompilerModules()
  );

  var supportcodereference = require('./lib/supportcodereference');
  var supportCodeLibrary = new supportcodereference.Library();
  supportCodeLibrary.loadFromPaths(supportCodeLoader.getPrimeSupportCodeFilePaths());
  supportCodeLibrary.loadFromPaths(supportCodeLoader.getSecondarySupportCodeFilePaths());

  res.append('Content-Type', 'text/plain');
  res.send(supportCodeLibrary.getReferenceSheet());
  });

app.get('/features', function(req, res)
  {
  // read features/*.feature files
  var configuration = Cucumber.Cli.Configuration([]);
  var features = [];

  configuration.getFeatureSources().forEach(function(feature)
    {
    features.push([
      path.basename(feature[0]),
      feature[1].toString()
      ]);
    });

  // res.append('Content-Type', 'application/json');
  res.json(features);
  });

/**
 * Run the submitted Gherkin feature text
 * Code inspired by cucumber/runtime.js
 */
app.post('/run', function(req, res)
  {
  var configuration = Cucumber.Cli.Configuration(['node', 'cucumber.js', '--tag=~@disabled']);
  var runtime   = Cucumber.Runtime(configuration);
  var formatter = Cucumber.Listener.JsonFormatter({});
  var listeners = Cucumber.Type.Collection();
  listeners.add(formatter);

  // we only have one feature source
  var featureSources = [ ['#runtime', new Buffer(req.body.feature), 'utf-8'] ];
  var parser         = Cucumber.Parser(featureSources, configuration.getAstFilter());
  var features       = parser.parse();

  var supportCodeLibrary = configuration.getSupportCodeLibrary();
  var options = {
    dryRun: false,
    failFast: false,
    strict: false
    };

  var astTreeWalker = Cucumber.Runtime.AstTreeWalker(features, supportCodeLibrary, listeners, options);

  Cucumber.Runtime.StackTraceFilter.filter();

  astTreeWalker.walk(function(result)
    {
    Cucumber.Runtime.StackTraceFilter.unfilter();
    res.append('Content-Type', 'application/json');
    res.send(formatter.getLogs());
    });
  });


process.env.EXPRESS_SERVER = true;
var server = app.listen(process.env.PORT || 3000, function()
  {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Client app listening at http://%s:%s', host, port);
  });
