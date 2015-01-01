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
 * @module jazzHands.test.unit.parser.sparql.baseDecl
 */
define([
    "qasht/package/Unit",
    "jazzHands/parser/sparql/baseDecl",
    "blocks/parser/Data",
    "RdfJs/test/api/Node"
], function (TestPackage, baseDecl, Data, testNodeApi) {
    return new TestPackage({
        module:  "jazzHands/parser/sparql/baseDecl",
        tests: [
            {
                name: "BASE keyword causes registration of IRI is a base prefix",
                input: "BASE <http://example.com/>",
                exec: function (test) {
                    test.whenResolved(baseDecl(test.data), function (out) {
                        testNodeApi(out, test);
                        test.assertEqual("<http://example.com/>", out.toNT());

                        test.assertEqual(out.toString(), test.data.base);

                        test.complete();
                    });
                }
            },
            {
                name: "BASE keyword requires IRI as next value",
                input: "BASE _:Invalid",
                exec: function (test) {
                    try {
                        return test.whenRejected(baseDecl(test.data), function (out) {
                            test.assertIsObject(out);
                            test.complete();
                        });
                    }
                    catch(err){
                        test.assertIsObject(err);
                        test.complete();
                    }
                }
            },
            {
                name: "returns NULL if base key word not found",
                input: "<http://example.com/>",
                exec: function (test) {
                    var out = baseDecl(test.data);

                    test.assertNull(out, "Null returned");

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.data = new Data({
                input: test.input,
                whiteSpace: function (data) {
                    data.pos++;
                }
            })
        }
    });
});