/*! dekeywordify 0.1.0 Original author Alan Plum <me@pluma.io>. Released into the Public Domain under the UNLICENSE. @preserve */
var transformTools = require('browserify-transform-tools'),
  esprima = require('esprima'),
  escodegen = require('escodegen'),
  traverse = require('ast-traverse');

var keywords = [
  // ES5 keywords
  'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with',
  // ES3 reserved future keywords
  'abstract', 'boolean', 'byte', 'char', 'class', 'const', 'debugger', 'double', 'enum', 'export', 'extends', 'final', 'float', 'goto', 'implements', 'import', 'int', 'interface', 'long', 'native', 'package', 'private', 'protected', 'public', 'short', 'static', 'super', 'synchronized', 'throws', 'transient', 'volatile'
];

module.exports = transformTools.makeStringTransform('dekeywordify', {}, function(src, opts, done) {
  var config = opts.config;
  var kws = keywords;
  if (config && config.extra && Array.isArray(config.extra)) {
    kws = kws.concat(config.extra);
  }
  if (config && config.allow && Array.isArray(config.allow)) {
    kws = kws.filter(function(kw) {
      return !~config.allow.indexOf(kw);
    });
  }
  var ast = esprima.parse(src);
  var modified = false;
  traverse(ast, {
    pre: function(node, parent) {
      if (
        node.type !== 'Identifier' ||
        !~keywords.indexOf(node.name)
      ) {
        return;
      }
      if (parent.type === 'MemberExpression') {
        parent.computed = true;
      } else if (parent.type !== 'Property') {
        return;
      }
      node.value = node.name;
      node.type = 'Literal';
      delete node.name;
      modified = true;
    }
  });
  if (modified) {
    done(null, escodegen.generate(ast));
  } else {
    done(null, src);
  }
});