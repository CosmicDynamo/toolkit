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
    "qasht/package/Unit",
    "jazzHands/parser/sparql/booleanLiteral",
    "blocks/parser/Data",
    "RdfJs/test/api/Node"
], function (TestPackage, booleanLiteral, Data, testNodeApi) {
    return new TestPackage({
        module: "jazzHands/parser/sparql/booleanLiteral",
        tests: [
            {
                name: "Return null if 'true' or 'false' key words not present",
                input: "{ ?s ?p ?o }",
                exec: function(test){
                    var out = booleanLiteral(test.data);

                    test.assertNull(out);

                    test.complete();
                }
            },
            {
                name: "Returns literal node when 'true' is found",
                input: "true asdf",
                exec: function(test){
                    var out = booleanLiteral(test.data);

                    testNodeApi(out, test);
                    test.assertEqual('"true"^^<http://www.w3.org/2001/XMLSchema#boolean>', out.toNT());
                    test.assertEqual(4, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "Returns literal node when 'false' is found",
                input: "false 134}",
                exec: function(test){
                    var out = booleanLiteral(test.data);

                    testNodeApi(out, test);
                    test.assertEqual('"false"^^<http://www.w3.org/2001/XMLSchema#boolean>', out.toNT());
                    test.assertEqual(5, test.data.pos);

                    test.complete();
                }
            }
        ],
        setUp: function(test){
            test.data = new Data({
                input: test.input
            });
        }

    });
});