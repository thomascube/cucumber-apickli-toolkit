/* jslint node: true */
'use strict';
var apickli = require('apickli');
var request = require('request');

/**
 * Extended Apickli class adding some extra features
 */
function ApickliExt(scheme, domain)
  {
  // call super constructor
  apickli.Apickli.call(this, scheme, domain);
  }

// inherit prototype
ApickliExt.prototype = apickli.Apickli.prototype;

/**
 * Generic http request method
 *
 * This allows to query both local resources (on the predefined host/domain)
 * as well as absilute URIs.
 */
ApickliExt.prototype.httprequest = function(method, resource, callback)   // callback(error, response)
  {
  var self = this;
  var args = {
    method: method.toUpperCase(),
    url: resource,
    headers: this.headers
  };

  // check if resource is a local path
  if (args.url.indexOf('http') < 0)
    args.url = this.domain + resource;

  // add request body
  if (args.method == 'POST' || args.method == 'PUT' || args.method == 'PATCH')
    args.body = this.requestBody;

  request(args, function(error, response)
    {
    if (error)
      return callback(error);

    self.httpResponse = response;
    callback(null, response);
    });
  };

ApickliExt.prototype.get = function(resource, callback)
  {
  return this.httprequest('GET', resource, callback);
  };

ApickliExt.prototype.head = function(resource, callback)
  {
  return this.httprequest('HEAD', resource, callback);
  };

ApickliExt.prototype.post = function(resource, callback)
  {
  return this.httprequest('POST', resource, callback);
  };

ApickliExt.prototype.put = function(resource, callback)
  {
  return this.httprequest('PUT', resource, callback);
  };

ApickliExt.prototype.patch = function(resource, callback)
  {
  return this.httprequest('PATH', resource, callback);
  };

ApickliExt.prototype.delete = function(resource, callback)
  {
  return this.httprequest('DELETE', resource, callback);
  };

ApickliExt.prototype.storeValueOfResponseBodyPathInGlobalScope = function(path, name)
  {
  var value = this.evaluatePathInResponseBody(path);
  this.setGlobalVariable(name, value[0]);
  };


exports.Apickli = ApickliExt;
