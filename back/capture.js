/* global phantom */

var page = require('webpage').create();
var system = require('system');

page.viewportSize = { width: 1920, height: 1080 };
page.settings.userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';

page.onError = function(msg, trace) {
  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(
        ' -> ' +
          t.file +
          ': ' +
          t.line +
          (t.function ? ' (in function "' + t.function + '")' : '')
      );
    });
  }

  console.error(msgStack.join('\n'));
};

page.onInitialized = function() {
  if (page.injectJs('shared/core.js')) {
    console.log('Polyfills loaded');
  }
};


page.open(system.args[1], function() {

  window.setTimeout(function() {
    page.render('captures/' + system.args[1] + '.png');
    phantom.exit();
  }, 5000);
});
