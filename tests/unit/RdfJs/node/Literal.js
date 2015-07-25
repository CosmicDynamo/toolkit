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
    "RdfJs/node/Literal",
    "RdfJs/node/Named",
    "RdfJs/node/Blank"
], function (intern, assert, Literal, Named, Blank) {
    return new intern({
        name: "RdfJs/node/Literal",
        "constructor: string parameter '<val>' will create a valid lNode": function(){
            var out = new Literal("value", "en", "xsd:string");

            assert.isObject(out);
            assert.strictEqual(out.interfaceName, "Literal");
            assert.strictEqual(out.nominalValue, "value");
            assert.strictEqual(out.datatype, "xsd:string");
            assert.strictEqual(out.language, "en");
        },
        "toString: returns stringified nominalValue": function(){
            var out = new Literal("value");

            assert.strictEqual(out.toString(), "\"value\"");
        },
        "valueOf: returns the javascript native type: xsd:string": function(){
            var out = new Literal("value", null, "http://www.w3.org/2001/XMLSchema#string");

            assert.strictEqual(out.valueOf(), "value");
        },
        "valueOf: returns the javascript native type: xsd:boolean": function(){
            var out = new Literal("true", null, "http://www.w3.org/2001/XMLSchema#boolean");
            var out2 = new Literal("false", null, "http://www.w3.org/2001/XMLSchema#boolean");

            assert.isTrue(out.valueOf());
            assert.isFalse(out2.valueOf());
        },
        "valueOf: returns the javascript native type: xsd:date/time": function(){
            var out = new Literal("2002-05-30T09:30:10-06:00", null, "http://www.w3.org/2001/XMLSchema#dateTime");
            var out2 = new Literal("2002-05-30", null, "http://www.w3.org/2001/XMLSchema#date");
            //var out3 = new lNode("09:30:10-06:00", null,"http://www.w3.org/2001/XMLSchema#time" );

            assert.strictEqual(out.valueOf().toString(), (new Date("May 30, 2002 9:30:10 GMT-06:00")).toString());
            assert.strictEqual(out2.valueOf().toString(), (new Date("May 30, 2002")).toString());
        },
        "valueOf: returns the javascript native type: xsd:int, integer, xsd:unsignedInt": function(){
            var out = new Literal("100", null, "http://www.w3.org/2001/XMLSchema#int");
            var out2 = new Literal("-100", null, "http://www.w3.org/2001/XMLSchema#integer");
            var out3 = new Literal("127", null, "http://www.w3.org/2001/XMLSchema#unsignedInt");

            assert.strictEqual(out.valueOf(), 100);
            assert.strictEqual(out2.valueOf(), -100);
            assert.strictEqual(out3.valueOf(), 127);
        },
        "valueOf: returns the javascript native type: xsd:double, float, decimal": function(){
            var out = new Literal("100.12", null, "http://www.w3.org/2001/XMLSchema#double");
            var out2 = new Literal("100.12654987", null, "http://www.w3.org/2001/XMLSchema#float");
            var out3 = new Literal("100.12654987", null, "http://www.w3.org/2001/XMLSchema#decimal");

            assert.strictEqual(out.valueOf(), 100.12);
            assert.strictEqual(out2.valueOf(), 100.12654987);
            assert.strictEqual(out3.valueOf(), 100.12654987);
        },
        "valueOf: returns the javascript native type: xsd:positiveInteger, nonNegativeInteger": function(){
            var out = new Literal("100", null, "http://www.w3.org/2001/XMLSchema#positiveInteger");
            var out2 = new Literal("127", null, "http://www.w3.org/2001/XMLSchema#nonNegativeInteger");

            assert.strictEqual(out.valueOf(), 100);
            assert.strictEqual(out2.valueOf(), 127);
        },
        "valueOf: returns the javascript native type: xsd:negativeInteger, nonPositiveInteger": function(){
            var out = new Literal("-100", null, "http://www.w3.org/2001/XMLSchema#negativeInteger");
            var out2 = new Literal("-100", null, "http://www.w3.org/2001/XMLSchema#nonPositiveInteger");

            assert.strictEqual(out.valueOf(), -100);
            assert.strictEqual(out2.valueOf(), -100);
        },
        "valueOf: returns the javascript native type: xsd:long": function(){
            var out = new Literal("987654321", null, "http://www.w3.org/2001/XMLSchema#long");

            assert.strictEqual(out.valueOf(), 987654321);
        },
        "valueOf: returns the javascript native type: xsd:short, xsd:unsignedShort": function(){
            var out = new Literal("123", null, "http://www.w3.org/2001/XMLSchema#short");

            assert.strictEqual(out.valueOf(), 123);
        },
        "valueOf: returns the javascript native type: xsd:byte": function(){
            var out = new Literal("127", null, "http://www.w3.org/2001/XMLSchema#byte");

            assert.strictEqual(out.valueOf(), 127);
        },
        "valueOf: returns the javascript native type: xsd:unsignedLong": function(){
            var out = new Literal("127", null, "http://www.w3.org/2001/XMLSchema#unsignedLong");

            assert.strictEqual(out.valueOf(), 127);
        },
        "valueOf: returns the javascript native type: xsd:unsignedShort": function(){
            var out = new Literal("250", null, "http://www.w3.org/2001/XMLSchema#unsignedShort");

            assert.strictEqual(out.valueOf(), 250);
        },
        "valueOf: returns the javascript native type: xsd:unsignedByte": function(){
            var out = new Literal("250", null, "http://www.w3.org/2001/XMLSchema#unsignedByte");

            assert.strictEqual(out.valueOf(), 250);
        },
        "toNT: returns the NT form of the lNode": function(){
            var out = new Literal("string", null, "http://www.w3.org/2001/XMLSchema#string");
            var out2 = new Literal("string", "en");

            assert.strictEqual(out.toNT(), "\"string\"^^<http://www.w3.org/2001/XMLSchema#string>");
            assert.strictEqual(out2.toNT(), "\"string\"@en");
        },
        "equals: returns false when compared to a lNode with a different nomVal": function(){
            var out = new Literal("string");
            var out2 = new Literal("string2");

            assert.isFalse(out.equals(out2));
        },
        "equals: returns false when compared to a named node": function(){
            var out = new Literal("string");
            var out2 = new Named("<string>");

            assert.isFalse(out.equals(out2));
        },
        "equals: returns false when compared to a blank node": function(){
            var out = new Literal("string");
            var out2 = new Blank("_:string");

            assert.isFalse(out.equals(out2));
        },
        "equals: returns true when compared to a diff lNode with the same nomVal": function(){
            var out = new Literal("string");
            var out2 = new Literal("string");

            assert.isTrue(out.equals(out2));
        }
    });
});