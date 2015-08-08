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
 * @module jazzHands.test.unit.query.function.ArgList
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/function/ArgList"
], function (TestPackage, ArgList) {
    return new TestPackage({
        module: "jazzHands/query/function/ArgList",
        tests: [
            {
                name: "Calls resolve on each arg and passes results into function",
                setUp: function (test) {
                    test.expr.args.push(test.gen("1"));
                    test.expr.args.push(test.gen(2));
                    test.expr.args.push(test.gen("ABC"));
                    test.dataRow = {
                        "a" :"row"
                    }
                },
                exec: function (test) {


                    test.expr.fn = function(arg1, arg2, arg3){
                        test.assertEqual(4, arguments.length);
                        test.assertEqual("1", arg1);
                        test.assertEqual(2, arg2);
                        test.assertEqual("ABC", arg3);

                        return "result";
                    };

                    test.assertEqual("result", test.expr.resolve(test.dataRow));

                    test.complete();
                }
            },
            {
                name: "distinct is passed in as last argument",
                setUp: function (test) {
                    test.expr.args.push(test.gen("1"));
                    test.dataRow = {
                        "a" :"row"
                    };

                    test.expr.fn = function(arg1, arg2){
                        test.assertEqual(2, arguments.length);
                        test.assertEqual(test.expr.distinct, arg2);

                        return "result";
                    };
                },
                exec: function (test) {
                    test.expr.distinct = true;
                    test.assertEqual("result", test.expr.resolve(test.dataRow));
                    test.expr.distinct = false;
                    test.assertEqual("result", test.expr.resolve(test.dataRow));

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.expr = new ArgList();

            test.gen = function (rtn) {
                return {
                    resolve: function (dataRow) {
                        test.assertEqual(dataRow, test.dataRow);
                        return rtn;
                    }
                };
            };
        },
        tearDown: function (test) {
        }
    });
});