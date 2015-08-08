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
 * @module jazzHands.test.unit.parser.match.find
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/parser/find",
    "tests/fake/blocks/parser/Data",
    "blocks/promise/when"
], function (TestPackage, assert, find, Data, when) {
    return TestPackage({
        name: "blocks/parser/find",
        "Requires each parser until one returns a value": function(){
            var data = new Data({
                input: "Pass"
            });

            var ready = find(data, [
                "tests/unit/blocks/parser/resource/returnNull",
                "tests/unit/blocks/parser/resource/returnValue"
            ]);
            assert.notEqual(ready, data.input, "Went async to require modules");

            var done = this.async();

            when(ready, done.callback(function (result) {
                assert.strictEqual(result, data.input);
            }));
        },
        "Handles promise returned by parser": function(){
            var data = new Data({
                input: "Pass"
            });

            var ready = find(data, [
                "tests/unit/blocks/parser/resource/returnPromise",
                "tests/unit/blocks/parser/resource/returnValue"
            ]);
            assert.notEqual(ready, data.input, "Went async to require modules");

            var done = this.async();

            when(ready, done.callback(function (result) {
                assert.strictEqual(result, data.input);
            }));
        },
        "Supports passing a parser directly into array": function(){
            var data = new Data({
                input: "Pass"
            });

            var result = find(data, [
                function (data) {
                    return data.input
                }
            ]);

            assert.strictEqual(result, data.input);
        }
    });
});