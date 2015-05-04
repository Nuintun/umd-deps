var cmdDeps = require('../index');
var detective = require('detective');
var Benchmark = require('benchmark');

var tests = {
  'normal': 'require("a");require(\'b"\');require("c\\"");function(require){return require;}',
  'reg & comment': '(1)/*\n*/ / require("a");function(require){return require;}',
  'after return': "return require('highlight.js').highlightAuto(code).value;function(require){return require;}",
  'in quote': '"require(\'a\')";function(require){return require;}',
  'in comment': 'require("a");//require("a");function(require){return require;}',
  'in multi comment': '/*\nrequire("a")*/require("a");function(require){return require;}',
  'in reg': '/require("a")/;function(require){return require;}',
  'in ifstmt with no {}': 'if(true)/require("a")/;function(require){return require;}',
  'in dostmt with no {}': 'do /require("a")/.test(s); while(false);function(require){return require;}',
  'reg / reg': '/require("a")/ / /require("b");function(require){return require;}',
  'ignore variable': 'require("a" + b);function(require){return require;}'
};
var results = {
  'normal': 3,
  'reg & comment': 1,
  'after return': 1,
  'in quote': 0,
  'in comment': 0,
  'in multi comment': 0,
  'in reg': 0,
  'in ifstmt with no {}': 0,
  'in dostmt with no {}': 0,
  'reg / reg': 0,
  'ignore variable': 0
};

Object.keys(tests).forEach(function (key){
  var suite = new Benchmark.Suite;
  var s = tests[key];
  // add tests
  suite.add('cmd-deps: ' + key, function (){
    return cmdDeps(s).length === results[key];
  }).add('detective: ' + key, function (){
    return cmdDeps(s).length === results[key];
  })
    // add listeners
    .on('cycle', function (event){
      console.log(String(event.target));
    })
    .on('complete', function (){
      console.log('  Fastest is ' + this.filter('fastest').pluck('name').toString().replace(/:.*/, ''));
    })
    .run();
});