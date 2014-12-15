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
 * @module $<class>$
 */
define([
    "blocks/promise/when",
    "blocks/require/create",
    "../match/hasChar",
    "./primaryExpression"
], function (when, create, hasChar, primaryExpression) {
    /**
     * [118] UnaryExpression ::= ['!' | '+' | '-']? PrimaryExpression
     * http://www.w3.org/TR/sparql11-query/#rUnaryExpression
     * @property {jazzHands.parser.Data} data
     * @return {Promise<*> | *}
     */
    function unaryExpression(data){
        var start = data.pos;
        var mod = hasChar(data, ['!', '+', '-']);
        return when(primaryExpression(data), function(result){
            if (!result){
                data.pos = start;
                return null;
            }

            var arg = { expression: result };
            if (mod === "!"){
                return create("jazzHands/query/expression/logic/Not", arg);
            } else if (mod === "-"){
                return create("jazzHands/query/expression/Negate", arg);
            }
            return result
        })
    }
    return unaryExpression;
});