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
 * @module jazzHands.parser.match.anyKeyWord
 */
define([
    "./keyWord",
    "polyfill/has!Array.find"
], function (keyWord) {
    /**
     * Loops through the input key words for any successful matches
     * @public
     * @param {jazzHands.parser.Data} data - Information about the parsing process
     * @param {String[]} keyWords - A list of possible words that should/could be next in the string
     * @param {Boolean} [caseSensitive=false] - indicates if case should be considered in the strings value
     * @param {Boolean} [whiteSpace=false] - indicates if case should ignore leading white space
     * @return {String | null} - the matched keyWord as it appeared in the input; or null if keyWord was not found
     */
    function anyKeyWord(data, keyWords, caseSensitive, whiteSpace){
        return keyWords.find(function(word){
            return keyWord(data, word, caseSensitive, whiteSpace);
        }) || null;
    }
    return anyKeyWord;
});