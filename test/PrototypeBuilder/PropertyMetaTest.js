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
test('PrototypeBuilder:PropertyMetaTest', function(assert) {

    var proto = JOII.PrototypeBuilder('Test', {}, {
        'defaults'                                      : 1,
        'protected function i_am_protected'             : function() {},
        'final protected function i_am_final_protected' : function() {},
        'abstract public function i_am_abstract_func'   : function() {},
        'static i_am_static'                            : 's'
    });

    var meta = proto.__joii__.metadata;

    var test_meta = {
        'defaults':             { type: null,       visibility: 'public',    is_abstract: false, is_final: false, is_static: false },
        'i_am_protected':       { type: 'function', visibility: 'protected', is_abstract: false, is_final: false, is_static: false },
        'i_am_final_protected': { type: 'function', visibility: 'protected', is_abstract: false, is_final: true,  is_static: false },
        'i_am_abstract_func':   { type: 'function', visibility: 'public',    is_abstract: true,  is_final: false, is_static: false },
        'i_am_static':          { type: null,       visibility: 'public',    is_abstract: false, is_final: false, is_static: true  }
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

    // Test property descriptors get trimmed
    var pX;
    var px_meta;
    assert.ok((function() {
        try {
            pX = JOII.PrototypeBuilder(undefined, {}, {
                '          this_should_not_throw_an_error         ' : 'foo',
                '            thisShouldNotThrowAnError            ' : function() {},
                'boolean	tab_instead_of_spaces_should_not_fail'  : true
            });
            px_meta = pX.__joii__.metadata;

            return true; // test succeeded
        } catch (e) {
            console.error('Test "Property descriptors get trimmed" failed:', e);
            return false; // test failed
        }
    })(), 'Property descriptors get trimmed (see console output for error message)');

    assert.equal(px_meta && px_meta.this_should_not_throw_an_error.name,       'this_should_not_throw_an_error', 'this_should_not_throw_an_error: name OK.');
    assert.equal(px_meta && px_meta.this_should_not_throw_an_error.type,       null,                             'this_should_not_throw_an_error: type OK.');
    assert.equal(px_meta && px_meta.this_should_not_throw_an_error.visibility, 'public',                         'this_should_not_throw_an_error: is_public OK.');
    assert.equal(px_meta && px_meta.this_should_not_throw_an_error.is_abstract, false,                           'this_should_not_throw_an_error: is_abstract OK.');
    assert.equal(px_meta && px_meta.this_should_not_throw_an_error.is_final,    false,                           'this_should_not_throw_an_error: is_final OK.');
    assert.equal(px_meta && px_meta.thisShouldNotThrowAnError.name,       'thisShouldNotThrowAnError', 'thisShouldNotThrowAnError: name OK.');
    assert.equal(px_meta && px_meta.thisShouldNotThrowAnError.type,       null,                        'thisShouldNotThrowAnError: type OK.');
    assert.equal(px_meta && px_meta.thisShouldNotThrowAnError.visibility, 'public',                    'thisShouldNotThrowAnError: is_public OK.');
    assert.equal(px_meta && px_meta.thisShouldNotThrowAnError.is_abstract, false,                      'thisShouldNotThrowAnError: is_abstract OK.');
    assert.equal(px_meta && px_meta.thisShouldNotThrowAnError.is_final,    false,                      'thisShouldNotThrowAnError: is_final OK.');
    assert.equal(px_meta && px_meta.tab_instead_of_spaces_should_not_fail.name,       'tab_instead_of_spaces_should_not_fail', 'this_should_not_throw_an_error: name OK.');
    assert.equal(px_meta && px_meta.tab_instead_of_spaces_should_not_fail.type,       'boolean',                               'this_should_not_throw_an_error: type OK.');
    assert.equal(px_meta && px_meta.tab_instead_of_spaces_should_not_fail.visibility, 'public',                                'this_should_not_throw_an_error: is_public OK.');
    assert.equal(px_meta && px_meta.tab_instead_of_spaces_should_not_fail.is_abstract, false,                                  'this_should_not_throw_an_error: is_abstract OK.');
    assert.equal(px_meta && px_meta.tab_instead_of_spaces_should_not_fail.is_final,    false,                                  'this_should_not_throw_an_error: is_final OK.');

    // Test validation of wrong combination of flags:

    // Multiple type definitions are not allowed.
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'public number string test' : 1 });
    }, function(err) { return err === 'Property "test" has multiple type defintions.'; }, 'Validate: multiple type definitions');

    // A property cannot be protected and public at the same time.
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'protected public function test' : function() {} });
    }, function(err) { return err === 'Property "test" cannot be both protected and public at the same time.'; }, 'Validate: protected + public');

    // A property cannot be abstract and final at the same time.
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'final abstract function test' : function() {} });
    }, function(err) { return err === 'Property "test" cannot be both abstract and final at the same time.'; }, 'Validate: abstract + final');

    // Some invalid property flag that doesn't exist...
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'foobar test' : function() {} });
    }, function(err) { return err === 'Syntax error: unexpected "foobar" in property declaration of "test".'; }, 'Validate: Undefined flags.');

    // Test inheritance modifiers: changing visibility, final, abstract:

    // Visibility on properties may not change through the inheritance chain.
    assert.throws(function() {
        var a = JOII.PrototypeBuilder('Test', {}, { 'protected function test' : function() {} });
        JOII.PrototypeBuilder('Test', { 'extends': a }, { 'public function test' : function() {} });
    }, function(err) { return err === 'Member "test" must be protected as defined in the parent class.'; }, 'Validate: Visibility overruling.');

    // A final property may not be overwritten by a child class.
    assert.throws(function() {
        var a = JOII.PrototypeBuilder('Test', {}, { 'final protected function test' : function() {} });
        JOII.PrototypeBuilder('Test', { 'extends': a }, { 'protected function test' : function() {} });
    }, function(err) { return err === 'Final member "test" cannot be overwritten.'; }, 'Validate: Overriding final property.');

    // A static property may not have visibility modifiers.
    // TODO: remove when static + visibility is possible
    var visibilityModifiers = ['private', 'protected', 'public'];
    for (var i in visibilityModifiers) {
        if (!visibilityModifiers.hasOwnProperty(i)) continue;
        var visibilityModifier = visibilityModifiers[i];
        assert.throws(function() {
            var def = {};
            def[visibilityModifier + ' static test'] = function() {};
            JOII.PrototypeBuilder('Test', {}, def);
        }, function(err) { return err === 'A static property cannot have visibility modifiers.'; }, 'Validate: static + ' + visibilityModifier)
    }

    // A static property may not be abstract.
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'abstract static test' : function() {} });
    }, function(err) { return err === 'A static property cannot be abstract.'; }, 'Validate: static + abstract');

    // A static property may not be final.
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'final static test' : function() {} });
    }, function(err) { return err === 'A static property cannot be final.'; }, 'Validate: static + final');
});
