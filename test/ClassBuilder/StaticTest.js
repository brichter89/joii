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
test('ClassBuilder:StaticTest', function(assert) {

    var A = JOII.ClassBuilder({
        'static st_field_1' : 1,
        'static st_field_2' : 'other_value',

        'static getStaticContext' : function() {
            return this;
        },

        'static function stFn1' : function() {},

        'static function stFn2' : function() {},

        'public function getStaticValue' : function() {
            return this.static.st_field_1;
        }
    });

    var B = JOII.ClassBuilder({extends: A}, {
        'static st_field_2' : 'quack',

        'static stFn2' : function() {
            return 'overwritten-stFn2-return';
        }
    });

    var a = new A();
    var a2 = new A();
    var b = new B();
    var b2 = new B();

    // Test static functions exist.
    assert.equal(A.st_field_1,   1,            'Class has static field.');
    assert.equal(typeof(A.stFn1), 'function',  'Class has static function.');
    assert.equal(typeof(a.stFn1), 'undefined', 'Instance interface has no static function.');

    // Test static methods have correct context.
    assert.equal(A.getStaticContext(),               A,           'Static methods context is the class itself');
    assert.equal(typeof(A.getStaticContext().stFn1), 'function',  'Static methods can access other static properties');
    assert.equal(typeof(A.getStaticContext().fn),    'undefined', 'Static methods can not access non-static properties');

    // Test inheritance
    assert.equal(B.st_field_1,         1,                          'Class has inherited static field.');
    assert.equal(B.st_field_2,         'quack',                    'Class has overwritten static field.');
    assert.equal(typeof(B.stFn1),      'function',                 'Class has inherited static function.');
    assert.equal(B.stFn2(),            'overwritten-stFn2-return', 'Class has overwritten static function.');
    assert.equal(B.getStaticContext(), B,                          'Inherited static methods context is the class itself, not the superclass');
    assert.equal(typeof(b.stFn1),      'undefined',                'Instance interface has no inherited static function.');

    // Test static fields generate getters and setters.
    assert.equal(typeof(A.getStField1), 'function', 'Test static field generates static getter');
    assert.equal(typeof(A.setStField1), 'function', 'Test static field generates static setter');

    // Test static getters and setters.
    assert.equal(A.setStField1(1337), A,    'Test static setter returns context to enable chaining');
    assert.equal(A.st_field_1,        1337, 'Test static setter has changed static field value');
    assert.equal(A.getStField1(),     1337, 'Test static getter returns static field value');

    // Test static values change for all instances.
    A.setStField1(5);
    assert.equal((a.getStaticValue() + a2.getStaticValue()), 10, 'Test static values change for all instances');
    assert.equal((b.getStaticValue() + b2.getStaticValue()), 2,  'Test static values changes only in instances of that class');
});
