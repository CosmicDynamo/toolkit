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
 * @module tests.unit.RdfJs.PrefixMap
 */
define([
    "intern!object",
    "intern/chai!assert",
    "RdfJs/PrefixMap"
], function (intern, assert, PrefixMap) {
    return new intern({
        name: "RdfJs/PrefixMap",
        "constructor: takes values and default params to initialize the new PrefixMap": function (test) {
            var prefixMap = new PrefixMap({
                "test": "http://example.com/",
                "": "http://example.com/default#"
            });

            assert.strictEqual(prefixMap.get("test"), "http://example.com/");
            assert.strictEqual(prefixMap.get(""), "http://example.com/default#");
        },
        "get: returns the IRI for the input prefix": function(){
            var prefixMap = new PrefixMap({
                "test": "http://example.com/",
                "": "http://example.com/default#"
            });

            assert.strictEqual(prefixMap.get("test"), "http://example.com/");
        },
        "set: sets the IRI that will be used for the provided prefix": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-set-omittable-setter-void-DOMString-prefix-DOMString-iri"
            var prefixMap = new PrefixMap({
                "test": "http://example.com/",
                "": "http://example.com/default#"
            });

            assert.isNull(prefixMap.get("test2"));
            prefixMap.set("test2", "http://example.com/test2");
            assert.strictEqual(prefixMap.get("test2"), "http://example.com/test2");
        },
        "remove: will clear the provided prefix from the map": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-remove-omittable-deleter-void-DOMString-prefix
            var prefixMap = new PrefixMap({
                "test": "http://example.com/",
                "": "http://example.com/default#"
            });

            assert.strictEqual(prefixMap.get("test"), "http://example.com/");
            prefixMap.remove("test");
            assert.isNull(prefixMap.get("test"));
        },
        "resolve: Given a valid CURIE for which a prefix is known this method will return the resulting IRI ": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-resolve-DOMString-DOMString-curie
            var prefixMap = new PrefixMap({
                "test": "http://example.com/",
                "": "http://example.com/default#"
            });

            assert.strictEqual(prefixMap.resolve("test:value"), "http://example.com/value");
        },
        "resolve: If the prefix is not known then this method will return the input curie": function(){
            var prefixMap = new PrefixMap({
                "test": "http://example.com/",
                "": "http://example.com/default#"
            });

            assert.strictEqual(prefixMap.resolve("test2:value"), "test2:value");
        },
        "shrink: Given an IRI for which a prefix is known this method returns a CURIE": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-shrink-DOMString-DOMString-iri
            var prefixMap = new PrefixMap({
                "test": "http://example.com/",
                "": "http://example.com/default#"
            });

            assert.strictEqual(prefixMap.shrink("http://example.com/value"), "test:value");
        },
        "shrink: If multiple prefixes match it will return the shortest match": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-shrink-DOMString-DOMString-iri
            var prefixMap = new PrefixMap({
                "test": "http://example.com/",
                "": "http://example.com/default#"
            });

            prefixMap.set("test2", "http://example.com/test2/");
            prefixMap.set("test3", "http://example.com/test2/test3/");
            assert.strictEqual(prefixMap.shrink("http://example.com/test2/test3/value"), "test3:value");
        },
        "shrink: if no prefix is known the original IRI is returned": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-shrink-DOMString-DOMString-iri
            var prefixMap = new PrefixMap({
                "test": "http://example.com/",
                "": "http://example.com/default#"
            });

            assert.strictEqual(prefixMap.shrink("http://example.org/value"), "http://example.org/value");
        },
        "addAll: Adds all prefixes from one prefix map into this map, override = false": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-addAll-PrefixMap-PrefixMap-prefixes-boolean-override
            var prefixMap = new PrefixMap({
                "test": "http://example.com/",
                "": "http://example.com/default#"
            });

            var more = new PrefixMap({
                "test": "http://example.com/override",
                "test2": "http://example.com/test2",
                "": "http://example.com/default#new"
            });
            prefixMap.addAll(more, false);
            assert.strictEqual(prefixMap.get("test"), "http://example.com/");
            assert.strictEqual(prefixMap.get("test2"), "http://example.com/test2");
            assert.strictEqual(prefixMap.get(""), "http://example.com/default#");
        },
        "addAll: Adds all prefixes from one prefix map into this map, override = true": function(){
            //http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-addAll-PrefixMap-PrefixMap-prefixes-boolean-override
            var prefixMap = new PrefixMap({
                "test": "http://example.com/",
                "": "http://example.com/default#"
            });

            var more = new PrefixMap({
                "test": "http://example.com/override",
                "test2": "http://example.com/test2",
                "": "http://example.com/default#new"
            });
            prefixMap.addAll(more, true);
            assert.strictEqual(prefixMap.get("test"), "http://example.com/override");
            assert.strictEqual(prefixMap.get("test2"), "http://example.com/test2");
            assert.strictEqual(prefixMap.get(""), "http://example.com/default#new");
        }
    });
});