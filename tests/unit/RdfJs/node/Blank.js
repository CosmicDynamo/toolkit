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
 * @module tests.unit.RdfJs.node.Blank
 */
define([
    "intern!object",
    "intern/chai!assert",
    "RdfJs/node/Blank",
    "RdfJs/node/Literal",
    "RdfJs/node/Named"
], function (intern, assert, Blank, Literal, Named) {
    return new intern({
        name: "RdfJs/node/Blank",
        "constructor: null/undefined parameter will create bNode with a new id": function(){
            var out = new Blank();

            assert.isObject(out);
            assert.isString(out.nominalValue);
            assert.isTrue(out.nominalValue.length > 0);
            assert.strictEqual(out.interfaceName, "BlankNode");

            var out2 = new Blank();

            assert.notEqual(out.toNT(), out2.toNT());
        },
        "constructor: string parameter (w/ '_:') will create a valid bNode": function(){
            var out = new Blank("_:test");

            assert.isObject(out);
            assert.strictEqual(out.nominalValue, "test");
            assert.strictEqual(out.interfaceName, "BlankNode");
        },
        "constructor: string parameter (w/o '_:') will create a valid bNode": function(){
            var out = new Blank("test");

            assert.isObject(out);
            assert.strictEqual(out.nominalValue, "test");
            assert.strictEqual(out.interfaceName, "BlankNode");
        },
        "toString: returns nominal value with '_:' prefix": function(){
            var out = new Blank("_:test");

            assert.strictEqual(out.toString(), "_:test");
        },
        "valueOf: returns the nominalValue": function(){
            var out = new Blank("_:test");

            assert.strictEqual(out.valueOf(), out.nominalValue);
        },
        "toNT: returns the NT form of the bNode": function(){
            var out = new Blank("_:test");

            assert.strictEqual(out.toNT(), "_:test");
        },
        "equals: returns false when compared to a bNode with a different nomVal": function(){
            var out = new Blank("_:test");
            var out2 = new Blank("_:test2");

            assert.isFalse(out.equals(out2));
        },
        "equals: returns false when compared to a literal node": function(){
            var out = new Blank("_:test");
            var out2 = new Literal("test2");

            assert.isFalse(out.equals(out2));
        },
        "equals: returns false when compared to a named node": function(){
            var out = new Blank("_:test");
            var out2 = new Named("<test2>");

            assert.isFalse(out.equals(out2));
        },
        "equals: returns true when compared to a diff bNode with the same nomVal": function(){
            var out = new Blank("_:test");
            var out2 = new Blank("test");

            assert.isTrue(out.equals(out2));
        }
    });
});