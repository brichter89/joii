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

    var pA = JOII.PrototypeBuilder(undefined, {}, {
        'static st_field_1' : 'value',
        'static st_field_2' : 'other_value',

        'static function stFn1' : function() {
            return 'stFn1-return';
        },

        'static function stFn2' : function() {
            return 'stFn2-return';
        },

        'static stFn3' : function() {
            return this.st_field_1;
        },

        'static stFn4' : function() {
            return this.st_field_1;
        },

        'static stFn5' : function() {
            return this.st_field_2;
        },

        'static stFn6' : function() {
            return this.st_field_2;
        },

        'public function fn1' : function() {
            return this.st_field_1;
        },

        'public function fn2' : function() {
            return this.stFn1();
        }
    });

    var pB = JOII.PrototypeBuilder(undefined, {extends: pA}, {
        'static st_field_2' : 'quack',

        'static stFn2' : function() {
            return 'overwritten-stFn2-return';
        },

        'static stFn4' : function() {
            return this.st_field_1;
        },

        'static stFn6' : function() {
            return this.st_field_2;
        },

        'static stFn10' : function() {
            return this.st_field_1;
        },

        'static stFn11' : function() {
            return this.st_field_2;
        }
    });

    // Methods of instance can use static properties with 'this' if the prototype contains them.
    assert.equal(typeof(pA.st_field_1), 'string',       'Prototype contains static field');
    assert.equal(typeof(pA.stFn1),      'function',     'Prototype contains static function');
    assert.equal(pA.fn1(),              'value',        'Methods of instance can access static field with "this"');
    assert.equal(pA.fn2(),              'stFn1-return', 'Methods of instance can access static method with "this"');

    // Test inheritance of static properties
    assert.equal(typeof(pB.st_field_1), 'string',                   'Prototype contains inherited static field');
    assert.equal(pB.st_field_2,         'quack',                    'Prototype contains overwritten static field');
    assert.equal(typeof(pB.stFn1),      'function',                 'Prototype contains inherited static function');
    assert.equal(pB.stFn2(),            'overwritten-stFn2-return', 'Prototype contains overwritten static function');

    // Test scopes
    assert.equal(pB.stFn3(),  'value', 'Inherited function can access inherited field');
    assert.equal(pB.stFn4(),  'value', 'Overwritten function can access inherited field');
    assert.equal(pB.stFn5(),  'quack', 'Inherited function can access overwritten field');
    assert.equal(pB.stFn6(),  'quack', 'Overwritten function can access overwritten field');
    assert.equal(pB.stFn10(), 'value', 'New static function can access inherited field');
    assert.equal(pB.stFn11(), 'quack', 'New static function can access overwritten field');

    // Test prototype generates __joii__.statics for static properties
    assert.equal(typeof(pA.__joii__.statics), 'object', 'Prototype generates __joii__.statics for static properties');

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
