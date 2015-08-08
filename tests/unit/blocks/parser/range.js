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
 * @module blocks.test.unit.parser.range
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/parser/range",
    "blocks/parser/Data"
], function (TestSuite, assert, range, Data) {
    return TestSuite({
        name: "blocks/parser/range",
        
        "Returns Empty Array at end of input": function () {
            var data = new Data({
                input: ""
            });
            var out = range(data, 0, -1, function () {
                //this line is designed to always throw a failure if reached
                assert.ok(false, "End of string: can't get here");
            });

            assert.isArray(out);
            assert.strictEqual(0, out.length);
        },

        "Returns an array containing results from input function": function () {
            var data = new Data({
                input: "The quick brown fox jumps over the lazy dog"
            });
            var out = range(data, 0, -1, function (data) {
                return data.next();
            });
            assert.isArray(out);
            assert.strictEqual(data.input, out.join(""));
        },

        "separator:Will look for separator between each function return": function () {
            var data = new Data({
                input: "T,h,e, ,q,u,i,c,k, ,b,r,o,w,n, ,f,o,x, ,j,u,m,p,s, ,o,v,e,r, ,t,h,e, ,l,a,z,y, ,d,o,g"
            });
            var out = range(data, 0, -1, function (data) {
                return data.next();
            }, ",");

            assert.isArray(out);
            assert.strictEqual(data.input.split(",").join(""), out.join(""));
        },
        
        "separators: Will stop when no more separators are found": function () {
            var data = new Data({
                input: "T,h,e quick brown fox jumps over the lazy dog"
            });
            var out = range(data, 0, -1, function (data) {
                return data.next();
            }, ",");

            assert.isArray(out);
            assert.strictEqual("The", out.join(""));
        
        },
        
        "separator: MAY be optional between each function return": function () {
            var data = new Data({
                input: "T,h,e quick brown fox jumps over the lazy dog"
            });
            var out = range(data, 0, -1, function (data) {
                return data.next();
            }, ",", true);

            assert.isArray(out);
            assert.strictEqual("The quick brown fox jumps over the lazy dog", out.join(""));
        },
        
        
        "separator: Will ignore leading whitespace": function () {
            var data = new Data({
                input: "T ,h ,e quick brown fox jumps over the lazy dog"
            });

            data.whiteSpace = function (data) {
                data.pos++;
            };

            
            var out = range(data, 0, -1, function (data) {
                return data.next();
            }, ",");

            assert.isArray(out);
            assert.strictEqual("The", out.join(""));
        },
            
        "separator: Is Case sensitive": function () {
            var data = new Data({
                input: "TAhAea quick brown fox jumps over the lazy dog"
            });
            var out = range(data, 0, -1, function (data) {
                return data.next();
            }, "A");

            assert.isArray(out);
            assert.strictEqual("The", out.join(""));

            data.pos = 0;
            out = range(data, 0, -1, function (data) {
                return data.next();
            }, "a");

            assert.isArray(out);
            assert.strictEqual("T", out.join(""));
        },

        "Will stop when end of input is reached": function () {
            var data = new Data({
                input: "The quick brown fox jumps over the lazy dog"
            });
            var out = range(data, 0, -1, function (data) {
                return data.next();
            });

            assert.isArray(out);
            assert.strictEqual("The quick brown fox jumps over the lazy dog", out.join(""));
        },
        
        "Will return null if < min values were returned": function () {
            var data = new Data({
                input: "T,h,e, ,q,u,ick brown fox jumps over the lazy dog"
            });
            var out = range(data, 10, -1, function (data) {
                return data.next();
            }, ",");

            assert.isNull(out);
            assert.strictEqual(0, data.pos);
        },
        
        "Will return null if > max values were returned": function () {
            var data = new Data({
                input: "T,h,e, ,q,u,ick brown fox jumps over the lazy dog"
            });
            var out = range(data, 0, 2, function (data) {
                return data.next();
            }, ",");

            assert.isArray(out);
            assert.strictEqual(2, out.length);
            assert.strictEqual("Th", out.join(""));
            assert.strictEqual(4, data.pos);
        }
    });
});