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
 * @module jazzHands.test.unit.parser.char.utf16Encode
 */
define([
    "intern!object",
    "intern/chai!assert",
    "../../../string/utf16Encode"
], function (TestSuite, assert, utf16Encode) {
    return new TestSuite({
        name: "blocks/parser/utf16Encode",
        "'0x' HEX HEX HEX HEX converted to String": function(){
            assert.strictEqual(String.fromCharCode(0), utf16Encode("0x0000"));
            assert.strictEqual(String.fromCharCode(39321), utf16Encode("0x9999"));
            assert.strictEqual(String.fromCharCode(43690), utf16Encode("0xaaaa"));
            assert.strictEqual(String.fromCharCode(43690), utf16Encode("0xAAAA"));
            assert.strictEqual(String.fromCharCode(65535), utf16Encode("0xffff"));
            assert.strictEqual(String.fromCharCode(65535), utf16Encode("0xFFFF"));
        },
        "'0x' HEX HEX HEX HEX HEX HEX HEX HEX converted to String": function(){
            input: "\\U00000000\\U99999999\\Uaaaaaaaa\\UAAAAAAAA\\Uffffffff\\UFFFFFFFFStop",
            function char(code) {
                return String.fromCharCode(code);
            };
            assert.strictEqual(String.fromCharCode(0), utf16Encode("0x00000000"));
            assert.strictEqual(char(55846) + char(56729), utf16Encode("0x99999999"));
            assert.strictEqual(char(55914) + char(57002), utf16Encode("0xaaaaaaaa"));
            assert.strictEqual(char(55914) + char(57002), utf16Encode("0xAAAAAAAA"));
            assert.strictEqual(char(56255) + char(57343), utf16Encode("0xffffffff"));
            assert.strictEqual(char(56255) + char(57343), utf16Encode("0xFFFFFFFF"));
        }
    });
});