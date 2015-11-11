/*
Javascript Object                               ______  ________________
Inheritance Implementation                  __ / / __ \/  _/  _/\_____  \
                                           / // / /_/ // /_/ /    _(__  <
Copyright 2014, Harold Iedema.             \___/\____/___/___/   /       \
--------------------------------------------------------------- /______  / ---
Permission is hereby granted, free of charge, to any person obtaining  \/
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
------------------------------------------------------------------------------
*/

/**
 * Tests class property meta data and validation.
 */
test('PrototypeBuilder:StaticMetaTest', function(assert) {

    var proto = JOII.PrototypeBuilder(undefined, {}, {
        'static st_field' : 's',

        'static function stFn' : function () {}
    });

    var meta = proto.__joii__.metadata;

    var test_meta = {
        'st_field': { type: null,       visibility: 'public', is_abstract: false, is_final: false, is_static: true },
        'stFn':     { type: 'function', visibility: 'public', is_abstract: false, is_final: false, is_static: true }
    };

    for (var i in test_meta) {
        var name = i,
            m = meta[i],
            t = test_meta[i];

        // Test integrity of metadata properties.
        assert.equal(m.name,        name,          name + ': name OK');
        assert.equal(m.type,        t.type,        name + ': type OK');
        assert.equal(m.visibility,  t.visibility,  name + ': visibility OK');
        assert.equal(m.is_abstract, t.is_abstract, name + ': is_abstract OK');
        assert.equal(m.is_final,    t.is_final,    name + ': is_final OK');
        assert.equal(m.is_static,   t.is_static,   name + ': is_static OK');
    }

    // Test validation of wrong combination of flags:

    // A static property may not be abstract.
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'abstract static test' : function() {} });
    }, function(err) { return err === 'A static property cannot be abstract.'; }, 'Validate: static + abstract');

    // A static property may not be final.
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'final static test' : function() {} });
    }, function(err) { return err === 'A static property cannot be final.'; }, 'Validate: static + final');
});
