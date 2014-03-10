/*global describe, it */
var expect = require('expect.js'),
  dekeywordify = require('../');

describe('dekeywordify', function() {
  it('is a function', function() {
    expect(dekeywordify).to.be.a('function');
  });
  it('escapes matching keywords in object literals', function(done) {
    var tr = dekeywordify('foo.js');
    var data = '';
    tr.on('data', function(chunk) {
      data += chunk;
    });
    tr.on('end', function() {
      expect(data).to.equal('var foo = { \'finally\': true };');
      done();
    });
    tr.write('var foo = {finally: true};');
    tr.end();
  });
  it('escapes matching keywords in property names', function(done) {
    var tr = dekeywordify('foo.js');
    var data = '';
    tr.on('data', function(chunk) {
      data += chunk;
    });
    tr.on('end', function() {
      expect(data).to.equal('foo()[\'finally\'](bar);');
      done();
    });
    tr.write('foo().finally(bar);');
    tr.end();
  });
});