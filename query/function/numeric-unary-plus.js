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
 * @module jazzHands.query.function.numeric-unary-plus
 */
define([
    "dojo/_base/lang",
    "RdfJs/Node",
    "../exception/InvalidArgumentType"
], function(lang, Node, InvalidArgumentType){
    /**
     * Verifies an expression is numeric and returns it with sign unchanged
     * @see http://www.w3.org/TR/xpath-functions/#func-numeric-unary-plus
     * @param {RdfJs.Node | RdfJs.Node[]} node
     * @return {RdfJs.node.Literal<Number>}
     * @throws err:FORG0006, Invalid argument type
     */
    function unaryPlus(node){
        var valid = !lang.isArray(node) && node.isLiteral();

        if (valid){
            //This is where a complex reasoner belongs.  but instead I will rely on Rdf Literal Node to covert to a primitive
            var value = node.valueOf();
            valid = !(lang.isString(value) || isNaN(value));
            if (!valid){
                value = node.nominalValue;
                valid = value === "INF" || value === "-INF" || value === "NaN";
            }

        }

        if (!valid){
            throw new InvalidArgumentType({input: node, module: "jazzHands/query/expression/login/boolean"});
        }

        return node;
    }
    return unaryPlus;
});