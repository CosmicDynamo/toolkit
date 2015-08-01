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
 * @module tests.unit.blocks.parser.block
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/parser/block",
    "tests/fake/blocks/parser/Data",
    "blocks/promise/when",
    "polyfill/has!Promise"
], function (TestSuite, assert, block, Data, when) {
    return TestSuite({
        name: "blocks/parser/block",
        "Returns null if starting character not found": function(){
            var data = new Data({
                input: "Nothing"
            });

            var done = block(data, '{', '}', -1, -1, function(){
                assert.fail({message: "Unreachable code reached"});
            });
            assert.isNull(done, "Null value returned");
        },
        "Returns null if ending character not found": function(){
            var data = new Data({
                input: "{Nothing"
            });
            var idx =0 ;
            var output = ["1"];

            var done = block(data, '{', '}', -1, -1, function(){
                return output[idx++] || null;
            });
            assert.isNull(done, "Null value returned");
        },
        "Returns array of values from input parser return": function(){
            var data = new Data({
                input: "{}"
            });
            var idx =0 ;
            var output = ["1"];

            var done = block(data, '{', '}', -1, -1, function(){
                data.pos = 1;
                return output[idx++] || null;
            });
            assert.deepEqual(done, output, "Null value returned");
        },
        "Will wait for promise return from function to be resolved": function(){
            var resolve = null, reject;
            var rtn = new Promise(function(res, rej){
                resolve = res;
                reject = rej;
            });
            var data = new Data({
                input: "{}"
            });

            var output = ["1"];

            var done = block(data, '{', '}', -1, -1, function(){
                data.pos = 1;
                return rtn;
            });

            assert.isFunction(done.then, "Return is a promise");

            rtn = null;
            resolve(output[0]);

            return when(done, function(results){
                assert.deepEqual(results, output, "Null value returned");
            });
        },
        "Will call input parser once for each instance of separator found": function(){
            var data = new Data({
                input: "{1,2,3}"
            });
            var idx =0 ;
            var output = ["1", "2", "3"];

            var done = block(data, '{', '}', -1, -1, function(){
                data.pos++;
                return output[idx++] || null;
            }, ",");
            assert.deepEqual(done, output, "Null value returned");
        },
        "Returns null if function return count is less than min": function(){
            var data = new Data({
                input: "{1,2,3}"
            });
            var idx =0 ;
            var output = ["1", "2", "3"];

            var done = block(data, '{', '}', 4, -1, function(){
                data.pos++;
                return output[idx++] || null;
            }, ",");
            assert.isNull(done, output, "Null value returned");
        },
        "Returns null if end char not found at max": function(){
            var data = new Data({
                input: "{1,2,3}"
            });
            var idx =0 ;
            var output = ["1", "2", "3"];

            var done = block(data, '{', '}', -1, 2, function(){
                data.pos++;
                return output[idx++] || null;
            }, ",");
            assert.isNull(done, output.splice(0, 2), "Null value returned");
        },
        "Supports dynamically loading the parsing function": function(){
            var data = new Data({
                input: "{1,2,3}"
            });
            data.__maxReturn = 3;

            var done = block(data, '{', '}', -1, -1, "tests/unit/blocks/parser/resource/returnNextChar", ",");

            when(done, this.async().callback(function(results){
                assert.deepEqual(results, ["1", "2", "3"], "Null value returned");
            }));
        }
    });
});