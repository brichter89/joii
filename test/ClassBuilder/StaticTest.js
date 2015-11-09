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

        'static stFn' : function() {},

        'static getStaticContext' : function() {
            return this;
        },

        'public getContextOfStaticFunction' : function() {
            return this.getStaticContext();
        },

        'public getInstanceContext' : function() {
            return this;
        },

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

    var B = JOII.ClassBuilder({extends: A}, {
        'static st_field_2' : 'quack',

        'public getContextOfInheritedStaticFunction' : function() {
            return this.getStaticContext();
        },

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

    var a = new A();
    var b = new B();

    var context_a = a.getInstanceContext();
    var context_b = b.getInstanceContext();

    // Test static functions exist.
    assert.equal(A.st_field_1,   1,           'Class has static field.');
    assert.equal(typeof(A.stFn), 'function',  'Class has static function.');
    assert.equal(typeof(a.stFn), 'undefined', 'Instance interface has no static function.');

    // Test methods of instance can use static properties with 'this'.
    assert.equal(typeof(context_a.st_field_1), 'number',       'Context contains static field');
    assert.equal(typeof(context_a.stFn1),      'function',     'Context contains static function');
    assert.equal(context_a.fn1(),              1,              'Methods of instance can access static field with "this"');
    assert.equal(context_a.fn2(),              'stFn1-return', 'Methods of instance can access static method with "this"');

    // Test static methods have correct context.
    assert.equal(A.getStaticContext(),                    A,           'Static methods context is the class itself');
    assert.equal(typeof(A.getStaticContext().stFn),       'function',  'Static methods can access other static properties');
    assert.equal(typeof(A.getStaticContext().fn),         'undefined', 'Static methods can not access non static properties');
    assert.equal(a.getContextOfStaticFunction(),          A,          'Static method called from instance method has static context');

    assert.equal(B.getStaticContext(),                    B,          'Inherited static methods context is the class itself, not the superclass');
    assert.equal(b.getContextOfStaticFunction(),          B,          'Inherited static method called from inherited instance method has static context');
    assert.equal(b.getContextOfInheritedStaticFunction(), B,          'Inherited static method called from instance method has static context');

    // Test inheritance of static properties
    assert.equal(typeof(context_b.st_field_1), 'number',                   'Context contains inherited static field');
    assert.equal(context_b.st_field_2,         'quack',                    'Context contains overwritten static field');
    assert.equal(typeof(context_b.stFn1),      'function',                 'Context contains inherited static function');
    assert.equal(context_b.stFn2(),            'overwritten-stFn2-return', 'Context contains overwritten static function');

    // Test scopes (static)
    assert.equal(B.stFn3(),  1,       'Inherited static function can access inherited field');
    assert.equal(B.stFn4(),  1,       'Overwritten static function can access inherited field');
    assert.equal(B.stFn5(),  'quack', 'Inherited static function can access overwritten field');
    assert.equal(B.stFn6(),  'quack', 'Overwritten static function can access overwritten field');
    assert.equal(B.stFn10(), 1,       'New static static function can access inherited field');
    assert.equal(B.stFn11(), 'quack', 'New static static function can access overwritten field');

    // Test scopes (none static)
    assert.equal(context_b.stFn3(),  1,       'Inherited function can access inherited field');
    assert.equal(context_b.stFn4(),  1,       'Overwritten function can access inherited field');
    assert.equal(context_b.stFn5(),  'quack', 'Inherited function can access overwritten field');
    assert.equal(context_b.stFn6(),  'quack', 'Overwritten function can access overwritten field');
    assert.equal(context_b.stFn10(), 1,       'New static function can access inherited field');
    assert.equal(context_b.stFn11(), 'quack', 'New static function can access overwritten field');

    // Test static fields generate getters and setters.
    assert.equal(typeof(A.getStField1), 'function', 'Test static field generates static getter');
    assert.equal(typeof(A.setStField1), 'function', 'Test static field generates static setter');

    // Test static getters and setters.
    assert.equal(A.setStField1(1337), A,    'Test static setter returns context to enable chaining');
    assert.equal(A.st_field_1,        1337, 'Test static setter has changed static field value');
    assert.equal(A.getStField1(),     1337, 'Test static getter returns static field value')

});
