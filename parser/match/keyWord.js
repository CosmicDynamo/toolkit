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
 * @module jazzHands.parser.match.keyWord
 */
define([
    "./whiteSpace"
], function (whiteSpace) {
    /**
     * Returns the requested keyWord if it is next value in the input string
     * @description If the keyWord is found in the string then this method will increment the details.pos value to the end index of the keyWord in details.input
     * @param {jazzHands.parser.Data} data - Information about the parsing process
     * @param {String} keyWord - the string value to be found
     * @param {Boolean} [caseSensitive=false] - indicates if case should be considered in the strings value
     * @param {Boolean} [skipWhiteSpace=false] - indicates if case should ignore leading white space
     * @return {String | null} - the matched keyWord as it appeared in the input; or null if keyWord was not found
     */
    function keyWord(data, keyWord, caseSensitive, skipWhiteSpace){
        var start = data.pos;
        if (skipWhiteSpace) {
            whiteSpace(data);
        }
        var test = data.input.substr(data.pos, keyWord.length);

        var cmp = keyWord;
        if (!caseSensitive) {
            test = test.toUpperCase();
            cmp = cmp.toUpperCase();
        }

        if (test === cmp) {
            data.pos += test.length;
            return keyWord;
        }
        data.pos = start;
        return null;
    }
    return keyWord;
});