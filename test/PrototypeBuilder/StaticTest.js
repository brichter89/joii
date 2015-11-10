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
test('PrototypeBuilder:StaticTest', function(assert) {

    var defA = function() {};
    var defB = function() {};
    var pA = JOII.PrototypeBuilder(undefined, {}, {
        'static st_field_1' : 1,
        'static st_field_2' : 'other_value',

        'static getStaticContext' : function() {
            return this;
        },

        'static getStaticContext2' : function() {},

        'static function stFn1' : function() {},

        'public function fn1' : function() {}
    }, undefined, defA);

    var pB = JOII.PrototypeBuilder(undefined, {extends: pA}, {
        'static st_field_2' : 'quack',

        'static getStaticContext2' : function() {
            return this;
        },

        'static stFn2' : function() {
            return 'overwritten-stFn2-return';
        }
    }, undefined, defB);

    // TODO no getters/setters for functions!

    // Test prototype generates __joii__.statics for static properties
    assert.equal(typeof(pA.__joii__.statics),       'object',   'Prototype generates __joii__.statics for static properties');
    assert.equal(pB.__joii__.statics.st_field_1,    '1',        '__joii__.statics contains static field')
    assert.equal(typeof(pB.__joii__.statics.stFn1), 'function', '__joii__.statics contains static function')

    // Test prototype has property "static"
    assert.equal(typeof(pA.static), 'function', 'Prototype has property "static"');
    assert.equal(pA.static,         defA,       'Prototype "static" property is the "definition"');

    // Test methods of instance can use static methods with 'this'.
    assert.equal(typeof(pA.stFn1),      'function',  'Prototype contains static function');
    assert.equal(typeof(pA.st_field_1), 'undefined', 'Prototype does not contain static field');

    assert.equal(pA.getStaticContext(), defA, 'Static method called from instance method has static context (using "this")');

    // Test inheritance of static properties
    assert.equal(typeof(pB.stFn1),               'function',                 'Prototype contains inherited static function');
    assert.equal(pB.stFn2(),                     'overwritten-stFn2-return', 'Prototype contains overwritten static function');
    assert.equal(pB.__joii__.statics.st_field_1, '1',                        '__joii__.statics contains inherited static field')
    assert.equal(pB.__joii__.statics.st_field_2, 'quack',                    '__joii__.statics contains overwritten static field')

    // Test inheritance
    assert.equal(pB.getStaticContext(),  defB, 'Inherited static method called from instance method has static context of current class, not the superclass');
    assert.equal(pB.getStaticContext2(), defB, 'Overwritten static method called from instance method has static context of current class');

    // Test overwriting static with static or non-static with non-static does not throw errors
    assert.ok(JOII.PrototypeBuilder(undefined, {extends: pA}, {
        'static stFn1' : function() {}
    }), 'Overwriting static with static does not throw errors');
    assert.ok(JOII.PrototypeBuilder(undefined, {extends: pA}, {
        'public fn1' : function() {}
    }), 'Overwriting non-static with non-static does not throw errors');
    assert.ok(JOII.PrototypeBuilder(undefined, {extends: pA}, {
    }), 'Not overwriting static does not throw errors');

    // TODO: Uncomment when error for duplicate function name is thrown
    //assert.throws(function() {
    //    var pC = JOII.PrototypeBuilder(undefined, {}, {
    //        'public fn' : function() {},
    //        'static fn' : function() {}
    //    });
    //}, function(err) { return err === ''; }, 'Error when function name already exists')

    assert.throws(function() {
        JOII.PrototypeBuilder(undefined, {extends: pA}, {
            'public stFn1': function () {}
        });
    }, function(err) { return err === 'Member "stFn1" must be static as defined in the parent class.'; }, 'Error when overwriting static property with non static');

    assert.throws(function() {
        JOII.PrototypeBuilder(undefined, {extends: pA}, {
            'static fn1': function () {}
        });
    }, function(err) { return err === 'Member "fn1" must not be static as defined in the parent class.'; }, 'Error when overwriting non static property with static');
});
