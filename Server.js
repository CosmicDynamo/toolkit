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
    "RdfJs/ontology/xsd",
    "RdfJs/node/Literal",

    "polyfill/has!Array.filter"
], function (declare, _Component, jss, xsd, Literal) {
    /**
     * @class service.Server
     * @mixes core.app._Component
     */
    return declare([_Component], {
        /**
         * @property Host URL that should be used for all IRIs served by this service
         * @type {String}
         */
        proxyName: null,
        /**
         * @property Name of RDF Graph containing Server Configuration Data
         * @type {String}
         */
        configGraph: "UrlConfig",
        loadConfig: function(config){
            this.proxyName = config.proxyName;
            if (this.proxyName.endsWith("/")){
                this.proxyName = this.proxyName.substr(0, this.proxyName.length - 1);
            }

            return this.inherited(arguments);
        }/*,
        _childNodes: function(tokenMatches){
            var graph = this.config;

            var urlData;
            tokenMatches.forEach(function(triple){
                var children =  graph.match(triple.subject.toNT(), jss("hasChildren").toNT(), null);
                if (urlData){
                    urlData.addAll(children);
                }
                urlData = children;
            });
            return urlData;
        }/*,
        typeFromUrl: function(node){
            var significant = this._sigBits(node);

            significant = significant.map(function(string){
                return (new Literal(string, null, xsd("string").toString())).toNT();
            });

            var graph = this.config();
            var token = jss("token").toNT();
            var urlData = graph.match(null, token, significant[0]);

            var idx = 0;
            while(urlData.length > 0 && ++idx < significant.length){
                var children;
                urlData.forEach(function(triple){
                    var matches = graph.match(triple.subject.toNT(), jss("hasCollection").toNT(), null);
                    if (children){
                        children.addAll(matches);
                    }
                    children = matches;
                });

                urlData = graph.match(null, token, significant[idx]).filter(function(triple){
                    //Non-async function - Mutable variable won't cause any issues here
                    //noinspection JSReferencingMutableVariableFromClosure
                    return children.match(null, null, triple.subject.toNT()).length > 0;
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
        }*/,
        isCollection: function(url){
            url = url.toString();

            var parts = this._sigBits(url);
            var token = "/" + parts[parts.length - 1] + "/";
            var start = url.lastIndexOf(token) + token.length - 1;

            return url.indexOf("/id/", start) === -1

        },
        isNew: function(url){
            return url.toString().indexOf("/new/") > 0;
        },
        _sigBits: function(url){
            url = url.toString();
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
            return significant.filter(function(val){ return !!val; });
        },
        /**
         * Converts a RDF Node containing a URL into a path IRI if tht URL is served by this service
         * @param {RdfJs.Node} url
         * @returns {RdfJs.Node}
         */
        urlToPath: function(url){
            var convert = url.valueOf();

            if (convert.indexOf(this.proxyName) === 0) {
                convert = convert.replace(this.proxyName, "file://");
            }
            else if (convert.indexOf("/") === 0){
                convert = "file:/" + convert;
            }

            url.nominalValue = convert;
            return url;
        },
        /**
         * Converts a RDF Node containing a service path into a valid URL served by this service
         * @param {RdfJs.Node} path
         * @returns {RdfJs.Node}
         */
        pathToUrl: function(path){
            path.nominalValue = path.valueOf().replace("file:/", this.proxyName);

            return path;
        }
    });

});