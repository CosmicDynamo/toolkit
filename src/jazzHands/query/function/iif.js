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
 * @module jazzHands.query.function.boolean
 */
define([], function () {
    /**
     * Returns true if var is bound to a value. Returns false otherwise. Variables with the value NaN or INF are considered bound.
     * @see http://www.w3.org/TR/sparql11-query/#func-bound
     * @param {Object} execData
     * @param {jazzHands.query.DataRow} dataRow
     * @param {jazzHands.query._Expression} test
     * @param {jazzHands.query._Expression} ifTrue
     * @param {jazzHands.query._Expression} ifFalse
     * @return {RdfJs.Node}
     * @throws err:FORG0006, Invalid argument type
     */
    function bound(execData, dataRow, test, ifTrue, ifFalse) {
        var pass = test.resolve(execData, dataRow);
        if (pass && pass.valueOf()) {
            return ifTrue.resolve(execData, dataRow);
        }
        return ifFalse.resolve(execData, dataRow);
    }

    return bound;
});