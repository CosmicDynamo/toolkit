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
 * @module jazzHands.parser.sparql.pathEltOrInverse
 */
define([
    "blocks/promise/when",
    "../match/hasChar",
    "../match/required",
    "./pathElt"
], function (when, hasChar, required, pathElt) {
    /**
     * [92] PathEltOrInverse ::= PathElt | '^' PathElt
     * @see http://www.w3.org/TR/sparql11-query/#rPathEltOrInverse
     * @property {jazzHands.parser.Data} data
     * @return {Promise<*> | *}
     */
    return function(data){
        var inv = !!hasChar(data, "^");
        var elt = pathElt(data);
        if (inv){
            //While the spec doesn't specifically say required.  It looks like if I see a '^' in this context there MUST be
            // a pathElt next or the parser has no other place to go
            elt = required(elt, "'^' missing pathElt")
        }
        return when(elt, function(elt){
            if (elt){
               elt.inverse = inv;
            }
            return elt;
        });

    }
});