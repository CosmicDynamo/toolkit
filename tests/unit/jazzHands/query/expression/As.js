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
 * @module jazzHands.test.unit.query.expression.expression.As
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/expression/As",
    "jazzHands/query/DataRow"
], function (TestPackage, As, DataRow) {
    return new TestPackage({
        module: "jazzHands/query/expression/As",
        tests: [
            {
                name: "Will connect the return to the expected var name",
                exec: function(test){
                    test.dataRow.set("from", "A Value");

                    test.expr.resolve(test.dataRow);

                    test.assertEqual(test.dataRow.get("from"), test.dataRow.get("to"));

                    test.complete();
                }
            }
        ],
        setUp: function(test){
            test.dataRow = new DataRow();
            test.expr = new As({
                expression: {
                    resolve: function(obj){
                        test.assertEqual(test.dataRow, obj);
                        return test.dataRow.get("from");
                    }
                }
            });
            test.expr.as = {
                valueOf: function(){
                    return "to";
                }
            }
        }
    });
});