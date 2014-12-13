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
 * @module jazzHands.test.unit.parser.match.range
 */
define([
    "qasht/package/Unit",
    "jazzHands/parser/match/range",
    "jazzHands/parser/Data"
], function (TestPackage, range, Data) {
    return new TestPackage({
        module: "jazzHands/parser/match/range",
        tests: [
            {
                name: "Returns Empty Array at end of input",
                input: "",
                exec: function (test) {
                    var out = range(test.data, 0, -1, function(){
                        test.assertFail("End of string: can't get here");
                    });

                    test.assertIsArray(out);
                    test.assertEqual(0, out.length);

                    test.complete();
                }
            },
            {
                name: "Returns an array containing results from input function",
                input: "The quick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = range(test.data, 0, -1, function(data){
                        return data.next();
                    });

                    test.assertIsArray(out);
                    test.assertEqual(test.input, out.join(""));

                    test.complete();
                }
            },
            {
                name: "If results is an array they will concatenated",
                input: "The quick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = range(test.data, 0, -1, function(data){
                        return [data.next()];
                    });

                    test.assertIsArray(out);
                    out.forEach(function(value){
                        test.assertIsString(value);
                    });
                    test.assertEqual(test.input, out.join(""));

                    test.complete();
                }
            },
            {
                name: "separator:Will look for separator between each function return",
                input: "T,h,e, ,q,u,i,c,k, ,b,r,o,w,n, ,f,o,x, ,j,u,m,p,s, ,o,v,e,r, ,t,h,e, ,l,a,z,y, ,d,o,g",
                exec: function (test) {
                    var out = range(test.data, 0, -1, function(data){
                        return data.next();
                    }, ",");

                    test.assertIsArray(out);
                    test.assertEqual(test.input.split(",").join(""), out.join(""));

                    test.complete();
                }
            },
            {
                name: "separators: Will stop when no more separators are found",
                input: "T,h,e quick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = range(test.data, 0, -1, function(data){
                        return data.next();
                    }, ",");

                    test.assertIsArray(out);
                    test.assertEqual("The", out.join(""));

                    test.complete();
                }
            },
            {
                name: "separator: MAY be optional between each function return",
                input: "T,h,e quick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = range(test.data, 0, -1, function(data){
                        return data.next();
                    }, ",", true);

                    test.assertIsArray(out);
                    test.assertEqual("The quick brown fox jumps over the lazy dog", out.join(""));

                    test.complete();
                }
            },
            {
                name: "separator: Will ignore leading whitespace",
                input: "T ,h\n\r\t#Comment\n,e quick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = range(test.data, 0, -1, function(data){
                        return data.next();
                    }, ",");

                    test.assertIsArray(out);
                    test.assertEqual("The", out.join(""));

                    test.complete();
                }
            },
            {
                name: "separator: Is Case sensitive",
                input: "TAhAea quick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = range(test.data, 0, -1, function(data){
                        return data.next();
                    }, "A");

                    test.assertIsArray(out);
                    test.assertEqual("The", out.join(""));

                    test.data.pos = 0;
                    out = range(test.data, 0, -1, function(data){
                        return data.next();
                    }, "a");

                    test.assertIsArray(out);
                    test.assertEqual("T", out.join(""));

                    test.complete();
                }
            },
            {
                name: "Will stop when end of input is reached",
                input: "The quick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = range(test.data, 0, -1, function(data){
                        return data.next();
                    });

                    test.assertIsArray(out);
                    test.assertEqual(test.input, out.join(""));

                    test.complete();
                }
            },
            {
                name: "Will return null if < min values were returned",
                input: "T,h,e, ,q,u,ick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = range(test.data, 10, -1, function(data){
                        return data.next();
                    }, ",");

                    test.assertNull(out);
                    test.assertEqual(0, test.data.pos);

                    test.complete();
                }
            },
            {
                name: "Will return null if > max values were returned",
                input: "T,h,e, ,q,u,ick brown fox jumps over the lazy dog",
                exec: function (test) {
                    var out = range(test.data, 0, 2, function(data){
                        return data.next();
                    }, ",");

                    test.assertNull(out);
                    test.assertEqual(0, test.data.pos);

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.data = new Data({
                input: test.input
            });
        }
    });
});