/* jslint node: true */
'use strict';

module.exports = function()
  {
  // from https://github.com/apickli/apickli/blob/master/source/apickli/apickli-gherkin.js

  this.Given(/^I set (.*) header to (.*)$/, function(headerName, headerValue, callback) {
    this.apickli.addRequestHeader(headerName, headerValue);
    callback();
  });

  this.Given(/^I set body to (.*)$/, function(bodyValue, callback) {
    this.apickli.setRequestBody(bodyValue);
    callback();
  });

  this.Given(/^I pipe contents of file (.*) to body$/, function(file, callback) {
    this.apickli.pipeFileContentsToRequestBody(file, function(error) {
      if (error) {
        callback(error);
      }

      callback();
    });
  });

  this.Given(/^I have basic authentication credentials (.*) and (.*)$/, function(username, password, callback) {
    this.apickli.addHttpBasicAuthorizationHeader(username, password);
    callback();
  });

  this.When('I GET $resource', function(resource, callback) {
    this.apickli.get(resource, function(error, response) {
      if (error) {
        callback(error);
      }

      callback();
    });
  });

  this.When('I HEAD $resource', function(resource, callback) {
    this.apickli.head(resource, function(error, response) {
      if (error) {
        callback(error);
      }

      callback();
    });
  });

  this.When('I POST to $resource', function(resource, callback) {
    this.apickli.post(resource, function(error, response) {
      if (error) {
        callback(error);
      }

      callback();
    });
  });

  this.When('I PUT $resource', function(resource, callback) {
    this.apickli.put(resource, function(error, response) {
      if (error) {
        callback(error);
      }

      callback();
    });
  });

  this.When('I DELETE $resource', function(resource, callback) {
    this.apickli.delete(resource, function(error, response) {
      if (error) {
        callback(error);
      }

      callback();
    });
  });

  this.When('I PATCH $resource', function(resource, callback) {
    this.apickli.patch(resource, function(error, response) {
      if (error) {
        callback(error);
      }

      callback();
    });
  });

  this.When(/^I (GET|HEAD|POST|PUT|DELETE|PATCH) (.*) with variables/, function(method, resource, callback)
    {
    // replace all {{..}} variable placeholders
    while (resource.match(/\{\{([^}]+)\}\}/))
      {
      var value = this.apickli.getGlobalVariable(RegExp.$1) || '';
      resource = resource.replace('{{' + RegExp.$1 + '}}', value);
      }

    this.apickli[method.toLowerCase()](resource, function(error, response)
      {
      if (error)
        return callback(error);

      // self.httpLog.push(response);
      callback();
      });
    });

  this.When(/^I wait for (\d+) seconds/, function(pause, callback)
    {
    setTimeout(callback, pause * 1000);
    });

  this.Then('response header $header should exist', function(header, callback) {
    if (this.apickli.assertResponseContainsHeader(header)) {
      callback();
    } else {
      callback('response header ' + header + ' does not exists in response');
    }
  });

  this.Then('response header $header should not exist', function(header, callback) {
    if (this.apickli.assertResponseContainsHeader(header)) {
      callback('response header ' + header + ' exists in response');
    } else {
      callback();
    }
  });

  this.Then(/^response body should be valid (xml|json)$/, function(contentType, callback) {
    if (this.apickli.assertResponseBodyContentType(contentType)) {
      callback();
    } else {
      callback('response body is not valid ' + contentType);
    }
  });

  this.Then(/^response code should be (\d+)/, function(responseCode, callback) {
    if (this.apickli.assertResponseCode(responseCode)) {
      callback();
    } else {
      callback('response code is not ' + responseCode + ' but ' + this.apickli.getResponseObject().statusCode);
    }
  });

  this.Then(/^response code should not be (\d+)/, function(responseCode, callback) {
    if (this.apickli.assertResponseCode(responseCode)) {
      callback('response code is ' + responseCode);
    } else {
      callback();
    }
  });

  this.Then('response header $header should be $expression', function(header, expression, callback) {
    if (this.apickli.assertHeaderValue(header, expression)) {
      callback();
    } else {
      callback('response header ' + header + ' is not ' + expression);
    }
  });

  this.Then('response header $header should not be $expression', function(header, expression, callback) {
    if (this.apickli.assertHeaderValue(header, expression)) {
      callback('response header ' + header + ' is ' + expression);
    } else {
      callback();
    }
  });

  this.Then('response body should contain $expression', function(expression, callback) {
    if (this.apickli.assertResponseBodyContainsExpression(expression)) {
      callback();
    } else {
      callback('response body doesn\'t contain ' + expression);
    }
  });

  this.Then('response body should not contain $expression', function(expression, callback) {
    if (this.apickli.assertResponseBodyContainsExpression(expression)) {
      callback('response body contains ' + expression);
    } else {
      callback();
    }
  });

  this.Then(/^response body path (.*) should be (.*)$/, function(path, value, callback) {
    if (this.apickli.assertPathInResponseBodyMatchesExpression(path, value)) {
      callback();
    } else {
      callback('response body path ' + path + ' doesn\'t match ' + value);
    }
  });

  this.Then(/^response body path (.*) should not be (.*)$/, function(path, value, callback) {
    if (this.apickli.assertPathInResponseBodyMatchesExpression(path, value)) {
      callback('response body path ' + path + ' matches ' + value);
    } else {
      callback();
    }
  });

  // check for property in JSON responses
  this.Then(/^response body path (.*) has property (.*)$/, function(path, propname, callback)
    {
    var nodes = (this.apickli.evaluatePathInResponseBody(path) || []),
      node = nodes[0];

    if (node && node[propname] !== undefined)
      callback();
    else
      callback('response body path ' + path + ' doesn\'t have a property ' + propname);
    });

  this.When('I set bearer token', function(callback) {
    this.apickli.setBearerToken();
    callback();
  });

  this.When(/^I store the value of body path (.*) as access token$/, function(path, callback) {
    this.apickli.setAccessTokenFromResponseBodyPath(path);
    callback();
  });

  this.When(/^I store the value of response header (.*) as (.*) in global scope$/, function(headerName, variableName, callback) {
    this.apickli.storeValueOfHeaderInGlobalScope(headerName, variableName);
    callback();
  });

  this.When(/^I store the value of response header (.*) as (.*) in scenario scope$/, function(name, variable, callback) {
    this.apickli.storeValueOfHeaderInScenarioScope(name, variable);
    callback();
  });

  this.When(/^I store the value of body path (.*) as (.*) in global scope$/, function(path, variableName, callback) {
    this.apickli.storeValueOfResponseBodyPathInGlobalScope(path, variableName);
    callback();
  });

  this.When(/^I store the value of body path (.*) as (.*) in scenario scope$/, function(path, variable, callback) {
    this.apickli.storeValueOfResponseBodyPathInScenarioScope(path, variable);
    callback();
  });

  this.Then(/^value of global variable (.*) should be (.*)$/, function(variableName, variableValue, callback) {
    if (String(this.apickli.getGlobalVariable(variableName) === variableValue)) {
      callback();
    } else {
      callback('value of variable ' + variableName + ' isn\'t equal to ' + variableValue);
    }
  });

  this.Then(/^value of scenario variable (.*) should be (.*)$/, function(variableName, variableValue, callback) {
    if (this.apickli.assertScenarioVariableValue(variableName, variableValue)) {
      callback();
    } else {
      callback('value of variable ' + variableName + ' isn\'t equal to ' + variableValue);
    }
  });

  this.Given(/^I set (.*) as (.*) in global scope( if not exists)?$/, function(value, name, notexists, callback)
    {
    if (!notexists || this.apickli.getGlobalVariable(name) === undefined)
      this.apickli.setGlobalVariable(name, value);
    callback();
    });

  this.Given(/I have a variable (.*) in global scope/, function(name, callback)
    {
    if (this.apickli.getGlobalVariable(name))
      {
      this.print(this.apickli.getGlobalVariable(name));
      callback();
      }
    else
      callback('Variable ' + name + ' does not exist in global scope');
    });

  this.Then('print response headers', function(callback)
    {
    try
      {
      this.print(this.apickli.getResponseObject().headers, 'application/json');
      callback();
      }
    catch(e)
      {
      callback('No http response object');
      }
    });

  this.Then('print response body', function(callback)
    {
    var response = this.apickli.getResponseObject();
    if (!response || !response.body)
      return callback('No http response object');

    try
      {
      this.print(JSON.parse(response.body), 'application/json');
      }
    catch(e)
      {
      this.print(response.body);
      }

    callback();
    });

  this.Then('print response body path $path', function(path)
    {
    var nodes = (this.apickli.evaluatePathInResponseBody(path) || []);
    this.print(JSON.stringify(nodes[0], null, 4), 'application/json');
    });

  this.Then('print request headers', function(callback)
    {
    var response = this.apickli.getResponseObject();
    if (!response || !response.req)
      return callback('No http request object');

    this.print(response.req._header);
    callback();
    });

  this.Then('print request body', function(callback)
    {
    var response = this.apickli.getResponseObject();
    if (!response || !response.req)
      return callback('No http request object');

    try
      {
      this.print(JSON.parse(response.request.body), 'application/json');
      }
    catch(e)
      {
      this.print(response.req.body || '[empty]');
      }

    callback();
    });


};
