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
 * @module jazzHands.parser.Data
 */
define([
    "dojo/_base/declare",
    "RdfJs/PrefixMap",
    "dojo/Stateful"
], function (declare, PrefixMap, Stateful) {
    /**
     * Class used to store and transfer RDF string parsing information
     * @class jazzHands.parser.Data
     * @interface jazzHands.parser.Data
     */
    return declare([Stateful], {
        /** @property {String} the input string being parsed */
        input:null,
        /** @property {jazzHands.rdf.PrefixMap} a map to be used for resolving curies */
        prefixMap: null,
        /** @property {Number} the current parser location*/
        pos:null,
        constructor: function(){
            this.prefixMap = new PrefixMap();
        }
    });
});