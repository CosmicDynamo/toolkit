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
 * @module {ClassName}
 */
define([
    "jazzHands/parser/match/keyWord",
    "jazzHands/parser/match/required",
    "jazzHands/parser/match/find",
    "blocks/promise/when",
    "blocks/require/create"
], function (keyWord, required, find, when, create) {
    /**
     * [57] OptionalGraphPattern ::= 'OPTIONAL' GroupGraphPattern
     * @method jazzHands.parser.sparql.graph#optional
     * @see http://www.w3.org/TR/sparql11-query/#rOptionalGraphPattern
     */
    function optionalGraphPattern(data){
        var key = keyWord(data, 'OPTIONAL', false, true);
        if (key){
            return when(required(find(data, ["jazzHands/parser/sparql/graph/group"]), "'OPTIONAL' GroupGraphPattern"), function(graphPattern){
                return create("jazzHands/query/match/OptionalGraph", {
                    graphPattern: graphPattern
                })
            });
        }
        return key;
    }
    return optionalGraphPattern;
});