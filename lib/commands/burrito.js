'use strict';

var Command = require('../models/command');
var chalk = require('chalk');
var string = require('../utilities/string');
var fs = require('fs');

var FormUrlencoded = require('form-urlencoded');
var request = require("request");

var bin = '';
var emburritoHost = 'http://localhost:3000';
var emburritoSaveUrl = 'http://localhost:3000/api/save';
var emburritoUpdateUrl = 'http://localhost:3000/api/' + bin + 'save';


module.exports = Command.extend({
  name: 'burrito',
  works: 'everywhere',
  description: 'Outputs the usage instructions for all commands or the provided command',

  aliases: [undefined, 'b', 'burrito', '-b', '--burrito'],

  _displayHelpForCommand: function(commandName) {
    var Command = this.commands[string.classify(commandName)];

    // If the requested command doesn't exist, display an error message.
    if (!Command) {
      this.ui.write(chalk.red('No burrito entry for \'' + commandName + '\'\n'));
      return;
    }
    new Command({
      ui: this.ui,
      project: this.project
    }).printUsageInstructions();
  },

  run: function(commandOptions, rawArgs) {


    var js = fs.readFileSync("post_js.js", "utf8");
    this.ui.write("EmBurri.to'ing your project\n");
    var data = {
      html: '<!DOCTYPE html> <html> <head>   <meta charset="utf-8">   <title>JS Bin</title> </head> <body>   API test html <a href="http://emberjs.com">emberJs Link</a> </body> </html>',
      css: 'this is my css',
      javascript: js
    };
    var _this = this;
    var encodedPostData = FormUrlencoded.encode(data)
    // this.ui.write(encodedPostData + "\n");

    request({
      uri: emburritoSaveUrl,
      method: "POST",
      form: data
    }, function(error, response, body) {
      if (error) {
        // _this.ui.write(chalk.red("error: " + error));
      }
      // _this.ui.write("response: " + JSON.stringify(response));
      // _this.ui.write("body: " + body  + "\n");
      _this.ui.write(chalk.yellow("EmBurrito Successful!\n"));
      var bin = JSON.parse(body).url;
      _this.ui.write("Share URL:\n\t" + emburritoHost + "/" + bin + "\n");
      // _this.ui.write("");


    });

    // http.post(emburritoSaveUrl, encodedPostData, function(res) {
    //   res.setEncoding('utf8');
    //   res.on('data', function(chunk) {
    //     _this.ui.write(chunk);
    //   });
    // });

    // if (rawArgs.length === 0) {
    //   // Display usage for all commands.
    //   this.ui.write('Available commands in ember-cli:\n');

    //   Object.keys(this.commands).forEach(this._displayHelpForCommand.bind(this));
    // } else {
    //   // If args were passed to the burrito command,
    //   // attempt to look up the command for each of them.
    //   this.ui.write('Requested ember-cli commands:\n\n');

    //   // Iterate through each arg beyond the initial 'burrito' command,
    //   // and try to display usage instructions.
    //   rawArgs.forEach(this._displayHelpForCommand.bind(this));
    // }
  },

  usageInstructions: function() {
    return {
      anonymousOptions: '<command-name (Default: all)>'
    };
  }
});
