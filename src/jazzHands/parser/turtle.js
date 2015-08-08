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
 * @module jazzHands.parser.turtle
 */
define([
    "dojo/_base/Deferred",
    "dojo/_base/kernel",
    "dojo/when",
    "RdfJs/parser/Data",
    "RdfJs/parser/whiteSpace",
    "RdfJs/Graph",
    "./turtle/turtleDoc"
], function (Deferred, kernel, when, Data, whiteSpace, Graph, turtleDoc) {
    /* Implementation of <http://www.w3.org/TeamSubmission/turtle/> */
    function onError(error) {
        //var wP = "";
        error.failed = true;
        //TODO Add code to find line-number/position of the error
        error.message = "Parsing Error, '" + error.message + "', while parsing turtle document";
        var rejected = (new Deferred());
        rejected.reject(error);
        return rejected;
    }

    /**
     * @class jazzHands.parser.turtle
     * @mixes jazzHands.parser._Parser
     */
    function parse(turtleString, options) {
        options = options || {};
        options.input = turtleString;
        options.graph = new Graph();

        if (!options.base) {
            var loc = kernel.global.location;
            var base = loc ? (loc.origin + loc.pathname) : "";
            options.base = options.base || base.substr(0, base.lastIndexOf("/") + 1)
        }

        var data = new Data(options);
        data.whiteSpace = function () {
            return whiteSpace(data);
        };
        try {
            var done = turtleDoc(data);
        } catch(ex){
            return onError(ex);
        }

        return when(done, function () {
            data.whiteSpace();
            if (data.pos < data.input.length) {
                return onError({message: "Statement found after end of valid turtle"});
            }

            return data.graph;
        }, onError);
    }

    return parse;
});