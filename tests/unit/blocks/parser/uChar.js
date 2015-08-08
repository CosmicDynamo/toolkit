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
 * @module jazzHands.test.unit.parser.char.uChar
 */
define([
    "intern!object",
    "intern/chai!assert",
    "blocks/parser/uChar",
    "blocks/parser/Data"
], function (intern, assert, uChar, Data) {
    return intern({
        name: "blocks/parser/uChar",
        "valid syntax: '\\u' HEX HEX HEX HEX": function () {
            var data = new Data({
                input: "\\u0000\\u9999\\uaaaa\\uAAAA\\uffff\\uFFFFStop"
            });

            assert.strictEqual(String.fromCharCode(0), uChar(data));
            assert.strictEqual(String.fromCharCode(39321), uChar(data));
            assert.strictEqual(String.fromCharCode(43690), uChar(data));
            assert.strictEqual(String.fromCharCode(43690), uChar(data));
            assert.strictEqual(String.fromCharCode(65535), uChar(data));
            assert.strictEqual(String.fromCharCode(65535), uChar(data));

            assert.isNull(uChar(data));
            assert.strictEqual("Stop", data.input.substr(data.pos));
        },
        "valid syntax: '\\U' HEX HEX HEX HEX HEX HEX HEX HEX": function () {
            var data = new Data({
                input: "\\U00000000\\U99999999\\Uaaaaaaaa\\UAAAAAAAA\\Uffffffff\\UFFFFFFFFStop"
            });

            function char(code) {
                return String.fromCharCode(code);
            }

            assert.strictEqual(String.fromCharCode(0), uChar(data));
            assert.strictEqual(char(55846) + char(56729), uChar(data));
            assert.strictEqual(char(55914) + char(57002), uChar(data));
            assert.strictEqual(char(55914) + char(57002), uChar(data));
            assert.strictEqual(char(56255) + char(57343), uChar(data));
            assert.strictEqual(char(56255) + char(57343), uChar(data));

            assert.isNull(uChar(data));
            assert.strictEqual("Stop", data.input.substr(data.pos));
        }
    });
});