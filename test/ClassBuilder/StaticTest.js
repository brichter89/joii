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
        'static field' : 1,

        'static stFn' : function() {},

        'static getStaticContext' : function() {
            return this;
        },

        'public fn' : function() {},

        'public getContextOfStaticFunction' : function() {
            return this.getStaticContext();
        }
    });

    var B = JOII.ClassBuilder({extends: A}, {
        'public getContextOfInheritedStaticFunction' : function() {
            return this.getStaticContext();
        }
    });

    var a = new A();
    var b = new B();

    // Test static functions exist
    assert.equal(A.field,        1,           'Class has static field.');
    assert.equal(typeof(A.stFn), 'function',  'Class has static function.');
    assert.equal(typeof(a.stFn), 'undefined', 'Instance interface has no static function.');

    // Test static methods have correct context
    assert.equal(A.getStaticContext(),                    A,           'Static methods context is the class itself');
    assert.equal(typeof(A.getStaticContext().stFn),       'function',  'Static methods can access other static properties');
    assert.equal(typeof(A.getStaticContext().fn),         'undefined', 'Static methods can not access non static properties');
    assert.equal(a.getContextOfStaticFunction(),          A,          'Static method called from instance method has static context');

    assert.equal(B.getStaticContext(),                    B,          'Inherited static methods context is the class itself, not the superclass');
    assert.equal(b.getContextOfStaticFunction(),          B,          'Inherited static method called from inherited instance method has static context');
    assert.equal(b.getContextOfInheritedStaticFunction(), B,          'Inherited static method called from instance method has static context');

    // TODO: Test that inherited static functions have the correct context
});
