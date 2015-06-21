/**
 * @copyright
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Cosmic Dynamo LLC
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * @module tests.unit.RdfJs.node._Node
 */
define([
    "intern!object",
    "intern/chai!assert",
    "RdfJs/node/_Node"
], function (intern, assert, _Node) {
    return new intern({
        name: "RdfJs/node/_Node",
        "toString: returns the nominalValue": function(){
            var out = new _Node("Hello");

            assert.strictEqual( out.toString(), "Hello");
        },
        "valueOf: returns the nominalValue": function(){
            var out = new _Node({ nominalValue: "Hello"});

            assert.strictEqual(out.valueOf(), "Hello");
        },
        "toNT: returns the toString value": function(){
            var out = new _Node({ value: "Hello"});

            assert.strictEqual(out.toNT(), out.toString());
        },
        "equals: if toCompare is an RDF Node will compare the properties":function(){
            var left = new _Node("Hello");
            left.interfaceName = "World";
            var match = new _Node({nominalValue: "Hello"});
            match.interfaceName = "World";
            var diff1 = new _Node("World");
            diff1.interfaceName = "World";
            var diff2 = new _Node("Hello");
            diff2.interfaceName = "You";
            var diff3 = new _Node("Hello");
            diff3.datatype = "World";
            var diff4 = new _Node("Hello");
            diff4.language = "World";

            assert.isTrue(left.equals(match), "left.equals(match)");
            assert.isFalse(left.equals(diff1), "left.equals(diff1)");
            assert.isFalse(left.equals(diff2), "left.equals(diff2)");
            assert.isFalse(left.equals(diff3), "left.equals(diff3)");
            assert.isFalse(left.equals(diff4), "left.equals(diff4)");
        },
        "equals: if toCompare is a literal will compare vs this.valueOf": function(){
            var left = new _Node("Hello");

            assert.isTrue(left.equals("Hello"), 'left.equals("Hello")');
            assert.isFalse(left.equals("World"), 'left.equals("World")');
        },
        "isBlank: returns true if this is a blank node": function(){
            var node = new _Node("_:value");

            assert.isFalse(node.isBlank());
            node.interfaceName = "BlankNode";
            assert.isTrue(node.isBlank());
        },
        "isNamed: returns true if this is a named node": function(){
            var node = new _Node("<value>");

            assert.isFalse(node.isNamed());
            node.interfaceName = "NamedNode";
            assert.isTrue(node.isNamed());
        },
        "isLiteral returns true if this is a literal node": function(){
            var node = new _Node("\"value\"");

            assert.isFalse(node.isLiteral());
            node.interfaceName = "Literal";
            assert.isTrue(node.isLiteral());
        }
    });
});