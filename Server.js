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
 * @module service.Server
 */
define([
    "dojo/_base/declare",
    "core/app/_Component",
    "service/ontology/jss",
    "service/ontology/xsd"
], function (declare, _Component, jss, xsd) {
    /**
     * @class service.Server
     * @mixes core.app._Component
     */
    return declare([_Component], {
        configGraph: "UrlConfig",
        typeFromUrl: function(node){
            var url = node.toString();
            var parts = url.split("/");
            var significant = [];
            var idx;

            for(idx = 0; idx < parts.length; idx++){
                var part = parts[idx];
                if (part === "id"){
                    idx++; //Skip the id value
                } else if (part === "new"){
                    break;
                } else {
                    significant.push(part);
                }
            }
            significant = significant.map(function(string){
                return (new Literal(string, null, xsd("string").toString())).toNT();
            });

            var graph = this.config();
            var token = jss("token").toNT();
            var urlData = graph.match(null, token, significant[0]);

            idx = 0;
            while(urlData.length > 0 && ++idx < significant.length){
                urlData = graph.match(null, token, significant[idx]).filter(function(triple){
                    //Non-async function - Mutable variable won't cause any issues here
                    //noinspection JSReferencingMutableVariableFromClosure
                    return urlData.match(null, null, triple.subject.toNT()).length > 0;
                });
            }

            var objectType = null;
            if (urlData.length > 0){
                //TODO: decide if multiple matches should be an error condition
                var urlPart = urlData.toArray()[0].subject; //If more than one, just grab the first
                var typeTriple = graph.match(urlPart.toNT(), jss("objectType").toNT(), null);
                if (typeTriple.length > 0){
                    objectType = typeTriple.toArray()[0].object;
                }
            }
            return objectType;
        }
    });

});