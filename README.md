# Synopsis

**dekeywordify** is a [browserify](https://github.com/substack/node-browserify) transform for escaping property names that use reserved keywords.

Note that in order to be thorough, `dekeywordify` currently transforms the entire source code into an abstract syntax tree and back. This may cause problems with browserify's source maps. Or not.

This library uses [browserify-transform-tools](https://github.com/benbria/browserify-transform-tools), so you can also supply the configuration by adding a `dekeywordify` field to your project's `package.json` file.

[![stability 3 - stable](http://b.repl.ca/v1/stability-3_--_stable-yellowgreen.png)
](http://nodejs.org/api/documentation.html#documentation_stability_index) [![license - Unlicense](http://b.repl.ca/v1/license-Unlicense-lightgrey.png)](http://unlicense.org/) [![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=pluma&url=https://github.com/pluma/dekeywordify)

[![Build Status](https://travis-ci.org/pluma/dekeywordify.png?branch=master)](https://travis-ci.org/pluma/dekeywordify) [![Coverage Status](https://coveralls.io/repos/pluma/dekeywordify/badge.png?branch=master)](https://coveralls.io/r/pluma/dekeywordify?branch=master) [![Dependencies](https://david-dm.org/pluma/dekeywordify.png?theme=shields.io)](https://david-dm.org/pluma/dekeywordify)

[![NPM status](https://nodei.co/npm/dekeywordify.png?compact=true)](https://npmjs.org/package/dekeywordify)

# Rationale

When your favourite library's API was developed with only modern JavaScript engines in mind and you suddenly find yourself with code using reserved keywords as property names all over the place, this transform saves you the trouble of having to escape all references with their string literal equivalents.

# Install

## Node.js

### With NPM

```sh
npm install dekeywordify
```

### From source

```sh
git clone https://github.com/pluma/dekeywordify.git
cd dekeywordify
npm install
make test
```

# Basic usage example

## Source

```javascript
doSomething().then(doMoreThings).finally(function(arg) {
    console.log({var: arg});
});
```

## Result

```javascript
doSomething().then(doMoreThings)['finally'](function(arg) {
    console.log({'var': arg});
});
```

## Usage

```javascript
var browserify = require('browserify'),
    dekeywordify = require('dekeywordify'),
    b = browserify();

b.transform(dekeywordify);
b.add('./app.js');
b.bundle().pipe(require('fs').createWriteStream('bundle.js'));
```

# Usage example with configure

```javascript
var browserify = require('browserify'),
    dekeywordify = require('dekeywordify'),
    b = browserify();

b.transform(dekeywordify.configure({
    allow: ["debugger"], // keywords that should not be escaped
    extra: ["cheese"] // additional property names to escape
}));
b.add('./app.js');
b.bundle().pipe(require('fs').createWriteStream('bundle.js'));
```

# Usage example with package.json

## package.json

```json
{
    "name": "my-awesome-project",
    "devDependencies": {
        "browserify": "*",
        "dekeywordify": "*"
    },
    "dekeywordify": {
        "allow": ["debugger"],
        "forbid": ["cheese"]
    }
}
```

### Usage (API)

```javascript
var browserify = require('browserify'),
    dekeywordify = require('dekeywordify'),
    b = browserify();

b.transform(dekeywordify);
b.add('./app.js');
b.bundle().pipe(require('fs').createWriteStream('bundle.js'));
```

### Usage (Shell)

```sh
browserify -t dekeywordify ./app.js > bundle.js
```

# API

## dekeywordify.configure(config):transform

Creates a browserify transform that will use the given `config`:

### config.useDefaults:Boolean (default: true)

Whether to use the built-in keyword list (containing all keywords of ES5 in addition to the reserved future keyword list from ES3). If set to `false`, only the keywords listed in `config.extra` will be escaped.

### config.allow (optional)

An array of property names that should not be escaped even if they are (reserved) keywords.

### config.extra (optional)

An array of property names that should be escaped in addition to the keywords.

# Unlicense

This is free and unencumbered public domain software. For more information, see http://unlicense.org/ or the accompanying [UNLICENSE](https://github.com/pluma/dekeywordify/blob/master/UNLICENSE) file.