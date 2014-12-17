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
 * @module jazzHands.test.unit.parser.sparql.iriRef
 */
define([
    "qasht/package/Unit",
    "jazzHands/parser/sparql/iriRef",
    "jazzHands/parser/Data",
    "RdfJs/test/api/Node"
], function (TestPackage, iriRef, Data,testNodeApi) {
    return new TestPackage({
        module: "jazzHands/parser/sparql/iriRef",
        tests: [
            {
                name: "Will return Named Node given typical IRI",
                input: "<http://example.com/Object/id/0>",
                exec: function (test) {
                    var out = iriRef(test.data);

                    testNodeApi(out, test);
                    test.assertEqual(test.input, out.toNT());

                    test.complete();
                }
            },
            {
                name: "Will throw exception if IRI contains a ' '",
                input: "<http://example.co m/Object/id/0>",
                exec: function (test) {
                    try {
                        iriRef(test.data);
                        test.assertFail("Unreachable");
                    } catch(err){
                        test.assertIsObject(err, "Error was thrown")
                    }
                    test.complete();
                }
            },
            {
                name: "Will return Named Node given typical IRI with escaped uChar values",
                input: "<http://example.co\\u04D2m/Object/id/0>",
                exec: function (test) {
                    var out = iriRef(test.data);

                    testNodeApi(out, test);
                    test.assertEqual("<http://example.coӒm/Object/id/0>", out.toNT());

                    test.complete();
                }
            },
            {
                name: "IRI with leading / will use base prefix domain",
                input: "</Object/id/0>",
                setUp: function(test){
                    test.data.base = "http://example.com/Object"
                },
                exec: function (test) {
                    var out = iriRef(test.data);

                    testNodeApi(out, test);
                    test.assertEqual("<http://example.com/Object/id/0>", out.toNT());

                    test.complete();
                }
            },
            {
                name: "IRI with leading # will be appended to the base prefix",
                input: "<#0>",
                setUp: function(test){
                    test.data.base = "http://example.com/Object"
                },
                exec: function (test) {
                    var out = iriRef(test.data);

                    testNodeApi(out, test);
                    test.assertEqual("<http://example.com/Object#0>", out.toNT());

                    test.complete();
                }
            },
            {
                name: "Empty IRI will return the base",
                input: "<>",
                setUp: function(test){
                    test.data.base = "http://example.com/Object"
                },
                exec: function (test) {
                    var out = iriRef(test.data);

                    testNodeApi(out, test);
                    test.assertEqual("<http://example.com/Object>", out.toNT());

                    test.complete();
                }
            },
            {
                name: "IRI without ':' will return value appended to base without last directory",
                input: "<AltObject/id/0>",
                setUp: function(test){
                    test.data.base = "http://example.com/Object"
                },
                exec: function (test) {
                    var out = iriRef(test.data);

                    testNodeApi(out, test);
                    test.assertEqual("<http://example.com/AltObject/id/0>", out.toNT());

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.data = new Data({
                input: test.input
            })
        }
    });
});