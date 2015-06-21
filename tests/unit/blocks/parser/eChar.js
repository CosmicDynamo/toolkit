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
 * @module tests.blocks.parser.eChar
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/parser/eChar",
    "blocks/parser/Data"
], function (registerSuite, assert, eChar, Data) {
    return registerSuite({
        name: "blocks/parser/eChar",
        "valid syntax: '\\t'": function(){
            var data = new Data({
                input: "\\t"
            });

            assert.strictEqual("\\t", eChar(data));
            assert.isNull(eChar(data));
        },
        "valid syntax: '\\b'": function(){
            var data = new Data({
                input: "\\b"
            });

            assert.strictEqual("\\b", eChar(data));

            assert.isNull(eChar(data));
        },
        "valid syntax: '\\n'": function(){
            var data = new Data({
                input: "\\n"
            });

            assert.strictEqual("\\n", eChar(data));

            assert.isNull(eChar(data));
        },
        "valid syntax: '\\r'": function(){
            var data = new Data({
                input: "\\r"
            });

            assert.strictEqual("\\r", eChar(data));

            assert.isNull(eChar(data));
        },
        "valid syntax: '\\f'": function(){
            var data = new Data({
                input: "\\f"
            });

            assert.strictEqual("\\f", eChar(data));

            assert.isNull(eChar(data));
        },
        "valid syntax: '\\\\'": function(){
            var data = new Data({
                input: "\\\\"
            });

            assert.strictEqual("\\\\", eChar(data));

            assert.isNull(eChar(data));
        },
        "valid syntax: '\\\'": function(){
            var data = new Data({
                input: "\\'"
            });

            assert.strictEqual("\\'", eChar(data));

            assert.isNull(eChar(data));
        },
        "valid syntax: '\\\"'": function(){
            var data = new Data({
                input: "\\\""
            });

            assert.strictEqual('\\"', eChar(data));

            assert.isNull(eChar(data));
        }
    });
});