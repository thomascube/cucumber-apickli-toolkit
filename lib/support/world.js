'use strict';

function World()
  {
  this.accessToken = null;
  this.currentScenario = null;

  // helper method to print the given data to cucumber output
  this.print = function(string, mimetype)
    {
    if (typeof string !== 'string')
      string = JSON.stringify(string, null, 4);

    if (this.currentScenario)
      this.currentScenario.attach(string, mimetype || 'text/plain');

    // do not print when running in express server
    if (process.env.EXPRESS_SERVER)
      return;

    var indent = '    ', lines = [];
    string.split(/\n/).forEach(function(ln)
      {
      lines.push(indent + ln);
      });

    console.log(lines.join('\n'));
    };
  }


module.exports = function()
  {
  this.World = World;
  };
