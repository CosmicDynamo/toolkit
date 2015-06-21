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
 * @module tests.unit.RdfJs.node.Literal
 */
define([
    "intern!object",
    "intern/chai!assert",
    "RdfJs/node/Named",
    "RdfJs/node/Literal",
    "RdfJs/node/Blank"
], function (intern, assert, Named, Literal, Blank) {
    return new intern({
        name: "RdfJs/node/Named",
        "constructor: string parameter 'val' will create a valid nNode": function(){
            var out = new Named("urn:hasValue");

            assert.isObject(out);
            assert.strictEqual(out.nominalValue, "urn:hasValue");
            assert.strictEqual(out.interfaceName, "NamedNode");
        },
        "toString: returns nominal value": function(){
            var out = new Named("urn:hasValue");

            assert.strictEqual(out.toString(), "urn:hasValue");
        },
        "valueOf: returns the nominalValue": function(){
            var out = new Named("urn:hasValue");

            assert.strictEqual(out.valueOf(), "urn:hasValue");
        },
        "toNT: returns the NT form of the nNode": function(){
            var out = new Named("urn:hasValue");

            assert.strictEqual(out.toNT(), "<urn:hasValue>");
        },
        "equals: returns false when compared to a nNode with a different nomVal": function(){
            var out = new Named("urn:hasValue");
            var out2 = new Named("urn:NotValue");

            assert.isFalse(out.equals(out2));
        },
        "equals: returns false when compared to a literal node": function(){
            var out = new Named("urn:hasValue");
            var out2 = new Literal("test2");

            assert.isFalse(out.equals(out2));
        },
        "equals: returns false when compared to a blank node": function(){
            var out = new Named("urn:hasValue");
            var out2 = new Blank("_:001");

            assert.isFalse(out.equals(out2));
        },
        "equals: returns true when compared to a diff nNode with the same nomVal": function(){
            var out = new Named("urn:hasValue");
            var out2 = new Named("urn:hasValue");

            assert.isTrue(out.equals(out2));
        }
    });
});