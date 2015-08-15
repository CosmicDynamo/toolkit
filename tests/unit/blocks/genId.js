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
 * @module $<class>$
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/genId"
], function (intern, assert, genId) {
    return new intern({
        name: "blocks/genId",
        "genId: uses each code": function () {
            for(var idx = 0; idx < genId.codes.length; idx++){
                assert.strictEqual( "x" + genId.codes[idx], genId(), "code " + idx + "used");
            }
        },
        "genId: Each Code is unique": function () {
            var generated = {};
            for(var idx = 0; idx < genId.codes.length; idx++){
                var id = genId();
                assert.isUndefined(generated[id], "Id is unique");
                generated[id] = true;
            }
        },
        "genId: After all combinations are used, adds a char and starts over": function () {
            for(var idx = 0; idx < genId.codes.length; idx++){
                genId();
            }

            for(var idx1 = 0; idx1 < genId.codes.length; idx1++){
                for(idx = 0; idx < genId.codes.length; idx++){
                    var expected = "x" + genId.codes[idx1] + genId.codes[idx];
                    assert.strictEqual(expected, genId(), "code " + expected + "used");
                }
            }
        },
        beforeEach: function() {
            genId.id = [-1];
        }
    });
});