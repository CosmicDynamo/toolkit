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
 * @module jazzHands.test.unit.parser.sparql.nil
 */
define([
    "qasht/package/Unit",
    "jazzHands/parser/sparql/nil",
    "blocks/parser/Data"
], function (TestPackage, nil, Data) {
    return new TestPackage({
        module: "jazzHands/parser/sparql/nil",
        tests: [
            {
                name: "Will pull empty '(', ')' w/ whiteSpace",
                input: "(   )",
                exec: function (test) {
                    test.whenResolved(nil(test.data), function (out) {

                        test.assertIsObject(out);
                        test.assertIsFunction(out.resolve);
                        test.assertIsArray(out.args);
                        test.assertEqual(0, out.args.length);

                        test.complete();
                    });
                }
            },
            {
                name: "Will pull empty '(', ')' w/o whiteSpace",
                input: "()",
                exec: function (test) {
                    test.whenResolved(nil(test.data), function (out) {

                        test.assertIsObject(out);
                        test.assertIsFunction(out.resolve);
                        test.assertIsArray(out.args);
                        test.assertEqual(0, out.args.length);

                        test.complete();
                    });
                }
            },
            {
                name: "Will return null if no '('",
                input: "",
                exec: function (test) {
                    test.whenResolved(nil(test.data), function (out) {
                        test.assertNull(out);

                        test.complete();
                    });
                }
            },
            {
                name: "Will return null if no ')'",
                input: "(",
                exec: function (test) {
                    test.whenResolved(nil(test.data), function (out) {
                        test.assertNull(out);

                        test.complete();
                    });
                }
            }
        ],
        setUp: function (test) {
            test.data = new Data({
                input: test.input,
                whiteSpace: function (data) {
                    if (data.input[data.pos] === ' ') {
                        data.pos++;
                        return 1;
                    }
                    return null;
                }
            })
        }
    });
});