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
 * @module jazzHands.test.unit.parser.sparql.booleanLiteral
 */
define([
    "intern!object",
    "intern/chai!assert",
    "RdfJs/parser/booleanLiteral",
    "blocks/parser/Data",
    "api/RdfJs/Node"
], function (intern, assert, booleanLiteral, Data, testNodeApi) {
    return new intern({
        module: "jazzHands/parser/sparql/booleanLiteral",
        "Return null if 'true' or 'false' key words not present": function () {
            var data = new Data({
                input: "{ ?s ?p ?o }"
            });

            var out = booleanLiteral(data);

            assert.isNull(out);
        },
        "Returns literal node when 'true' is found": function () {
            var data = new Data({
                input: "true asdf"
            });

            var out = booleanLiteral(data);

            testNodeApi(out);
            assert.strictEqual('"true"^^<http://www.w3.org/2001/XMLSchema#boolean>', out.toNT());
            assert.strictEqual(4, data.pos);
        },
        "Returns literal node when 'false' is found": function () {
            var data = new Data({
                input: "false 134}"
            });

            var out = booleanLiteral(data);

            testNodeApi(out);
            assert.strictEqual('"false"^^<http://www.w3.org/2001/XMLSchema#boolean>', out.toNT());
            assert.strictEqual(5, data.pos);
        }
    });
});