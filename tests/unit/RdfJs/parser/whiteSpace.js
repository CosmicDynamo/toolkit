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
 * @module jazzHands.test.unit.parser.match.whiteSpace
 */
define([
    "intern!object",
    "intern/chai!assert",
    "RdfJs/parser/whiteSpace",
    "blocks/parser/Data"
], function (intern, assert, whiteSpace, Data) {
    return new intern({
        name: "RdfJs/parser/whiteSpace",
        "Moves parser position past ' ' character": function(){
            var data = new Data({
                input: "          "
            });
            var out = whiteSpace(data);

            assert.isNull(out, "return value is null");
            assert.strictEqual(data.pos, data.input.length, "data position moved after the last ' ' found");
        },
        "Moves parser position past new line characters": function(){
            var data = new Data({
                input: "\n\n\n\n\n\n\n\n\n\n"
            });

            var out = whiteSpace(data);

            assert.isNull(out, "return value is null");
            assert.strictEqual(data.pos, data.input.length, "data position moved after the last \\n found");
        },
        "Moves parser position past line feed characters": function(){
            var data = new Data({
                input: "\r\r\r\r\r\r\r\r\r\r"
            });

            var out = whiteSpace(data);

            assert.isNull(out, "return value is null");
            assert.strictEqual(data.pos, data.input.length, "data position moved after the last \\r found");
        },
        "Moves parser position past tab characters": function(){
            var data = new Data({
                input: "\t\t\t\t\t\t\t\t\t\t"
            });

            var out = whiteSpace(data);

            assert.isNull(out, "return value is null");
            assert.strictEqual(data.pos, data.input.length, "data position moved after the last \\t found");
        },
        "Moves parser position past an assorted combination of all 'white space' characters": function(){
            var data = new Data({
                input: " \n\t\n\t\n  \r\r \n\t"
            });

            var out = whiteSpace(data);

            assert.isNull(out, "return value is null");
            assert.strictEqual(data.pos, data.input.length, "data position moved after the last \\t found");
        },
        "Stops on a non white space character": function(){
            var data = new Data({
                input: " \n\t\n\t\n  \r\r \n\ta\n \r\t"
            });

            var out = whiteSpace(data);

            assert.isNull(out, "return value is null");
            assert.strictEqual(data.input.substr(data.pos), "a\n \r\t", "data position moved to the first non whitespace character");

        }
    });
});