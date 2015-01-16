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
define([
    "RdfJs/node/Literal"
], function (LiteralNode) {
    /**
     * Converts an expression result to a Boolean Node
     * @see http://www.w3.org/TR/xpath-functions/#func-boolean
     * @param {Object} execData
     * @param {jazzHands.query.DataRow} dataRow
     * @param {jazzHands.query._Expression} expression
     * @return {RdfJs.node.Literal<Boolean>}
     * @throws err:FORG0006, Invalid argument type
     */
    function str(execData, dataRow, expression) {
        var out = expression.resolve(execData, dataRow);
        if (!out) {
            return null;
        }
        return new LiteralNode(out.nominalValue, null, "http://www.w3.org/2001/XMLSchema#string");
    }

    return str;
});