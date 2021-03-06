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
 * @module jazzHands.parser.sparql.objectList
 */
define([
    "blocks/promise/when",
    "blocks/parser/required",
    "blocks/parser/hasChar",
    "./directive",
    "./triples"
], function (when, required, hasChar, directive, triples) {
    /**
     * [2] statement ::= directive | triples '.'
     * @see http://www.w3.org/TR/turtle/#grammar-production-statement
     * @property {jazzHands.parser.Data} data
     * @return {Promise<*> | *}
     */
    function statement(data) {
        var ready = directive(data);
        if (!ready) {
            return when(triples(data), function (subject) {
                if (subject !== null) {
                    required(hasChar(data, '.', false, true), "statement missing '.'");
                }
                return subject;
            });
        }
        return when(ready, function (done) {
            data.whiteSpace();
            return done;
        });
    }

    return statement;
});