/**
 * @copyright
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Cosmic Dynamo LLC
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
 * @module tests.unit.RdfJs.Node
 */
define([
    "intern!object",
    "intern/chai!assert",
    "RdfJs/Node"
], function (intern, assert, Node) {
    return new intern({
        name: "RdfJs/Node",
        "Create Named Node by String": function(){
            var out = new Node("<urn:NamedNode>");

            assert.isObject(out);
            assert.strictEqual(out.nominalValue, "urn:NamedNode");
            assert.strictEqual(out.interfaceName, "NamedNode");

            assert.strictEqual(out.toNT(), "<urn:NamedNode>");
            assert.strictEqual(out.valueOf(), "urn:NamedNode");
            assert.strictEqual(out.toString(), "urn:NamedNode");
        },
        "Create Literal Node by String": function(){
            var out = new Node("\"value\"^^<http://www.w3.org/2001/XMLSchema#string>");

            assert.isObject(out);
            assert.strictEqual(out.nominalValue, "value");
            assert.strictEqual(out.datatype, "http://www.w3.org/2001/XMLSchema#string");
            assert.strictEqual(out.interfaceName, "Literal");

            assert.strictEqual(out.toNT(), "\"value\"^^<http://www.w3.org/2001/XMLSchema#string>");
            assert.strictEqual(out.toNT(), out.toString());
            assert.strictEqual(out.valueOf(), "value");
        },
        "Create Blank Node by String": function(){
            var out = new Node("_:001");

            assert.isObject(out);
            assert.strictEqual(out.nominalValue, "001");
            assert.strictEqual(out.interfaceName, "BlankNode");

            assert.strictEqual(out.toNT(), "_:001");
            assert.strictEqual(out.toString(), "_:001");
            assert.strictEqual(out.valueOf(), "001");
        }
    });
});