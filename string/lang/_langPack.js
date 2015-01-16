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
 * @module blocks.string.lang._langPack
 */
define([
    "dojo/_base/declare"
], function (declare) {
    /**
     * @class blocks.string.lang._langPack
     */
    return declare([], {
        sortKey: null,
        constructor: function () {

            var counter = 0, buffer = '', next = '',
                multiCodePoints = [], bufferArray = [], bufferLiteral;
            /*
             * TODO: more advanced sorting on loading might be needed for a,b sorts on mutli point letter languages
             * if a smaller substring is weighted greater than a string, e.g, 'cs' > 'ccs'.
             */
            var sortMultiCodePoint = function () {
            };

            var tableArray = this.collation.split('');
            var codePoints = [];

            tableArray.forEach(function (char, idx, arr) {
                if (char !== '+') {
                    buffer += char;
                    counter++;
                }

                if (counter === 4) {
                    next = arr[idx + 1];

                    if (next !== '+') {
                        bufferArray = buffer.replace(/\w{4}/g, '\|$&');
                        bufferLiteral = '';
                        bufferArray = bufferArray.split('|');
                        bufferArray.shift();

                        bufferArray.forEach(function (buff) {
                            bufferLiteral += String.fromCharCode(parseInt('0x' + buff, 16));
                        });

                        codePoints.push(bufferLiteral);
                        if (bufferArray.length > 1) {
                            multiCodePoints.push({codePoints: bufferLiteral, collationWeight: (codePoints.length - 1)});
                        }

                        buffer = '';
                    }

                    counter = 0;
                }
            });

            this.collation = codePoints;
            if (multiCodePoints.length) {
                lasca.language.multiLetters = multiCodePoints;
                sortMultiCodePoint();
            }
        },
        compareAscii: function (a, b) {
            var aCode = a.charCodeAt(0),
                bCode = b.charCodeAt(0);
            if (aCode === bCode) {
                return 0;
            }
            return (aCode > bCode) ? 1 : -1;
        },
        compareLength: function (a, b) {
            var aLen = a.length;
            var bLen = b.length;
            if (aLen === bLen) {
                return 0;
            }
            return aLen > bLen ? 1 : -1;
        },
        setNonCollValCompare: function (func) {
            this.compareAscii = func;
        },
        sort: function (array, key) {
            this.sortKey = key || null;
            return array.sort(this.compare);
        }
    });
});