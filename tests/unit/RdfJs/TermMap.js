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
 * @module tests.unit.RdfJs.TermMap
 */
define([
    "intern!object",
    "intern/chai!assert",
    "RdfJs/TermMap"
], function (intern, assert, TermMap) {
    return new intern({
        name: "RdfJs/TermMap",
        "constructor: takes values and default params to initialize the new TermMap": function(){
            var termMap = new TermMap({
                "test": "http://example.com/"
            }, "http://example.com/default#");

            assert.strictEqual(termMap.get("test"), "http://example.com/");
            assert.strictEqual(termMap.getDefault(), "http://example.com/default#");
        },
        "get: returns the IRI for the input Term": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-get-omittable-getter-DOMString-DOMString-term"
            var termMap = new TermMap({
                "test": "http://example.com/"
            }, "http://example.com/default#");

            assert.strictEqual(termMap.get("test"), "http://example.com/");
        },
        "set: sets the IRI that will be used for the provided Term": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-set-omittable-setter-void-DOMString-term-DOMString-iri"
            var termMap = new TermMap({
                "test": "http://example.com/"
            }, "http://example.com/default#");

            assert.isNull(termMap.get("test2"));
            termMap.set("test2", "http://example.com/test2");
            assert.strictEqual(termMap.get("test2"), "http://example.com/test2");
        },
        "remove: will clear the provided Term from the map": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-remove-omittable-deleter-void-DOMString-term"
            var termMap = new TermMap({
                "test": "http://example.com/"
            }, "http://example.com/default#");

            assert.strictEqual(termMap.get("test"), "http://example.com/");
            termMap.remove("test");
            assert.isNull(termMap.get("test"));
        },
        "resolve: Given a valid CURIE for which a Term is known this method will return the resulting IRI ": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-resolve-DOMString-DOMString-term"
            var termMap = new TermMap({
                "test": "http://example.com/"
            }, "http://example.com/default#");

            assert.strictEqual(termMap.resolve("test"), "http://example.com/");
        },
        "resolve: If no term is known and a default has been set, the IRI is obtained by concatenating the term and the default iri.": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-resolve-DOMString-DOMString-term"
            var termMap = new TermMap({
                "test": "http://example.com/"
            }, "http://example.com/default#");

            assert.strictEqual(termMap.resolve("test2"), "http://example.com/default#test2");
        },
        "resolve: If the Term is not known and there is no default then this method will return the input": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-resolve-DOMString-DOMString-term"
            var termMap = new TermMap({
                "test": "http://example.com/"
            });

            assert.strictEqual(termMap.resolve("test2"), "test2");
        },
        "shrink: Given an IRI for which a Term is known this method returns a CURIE": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-shrink-DOMString-DOMString-iri"
            var termMap = new TermMap({
                "test": "http://example.com/"
            }, "http://example.com/default#");

            assert.strictEqual(termMap.shrink("http://example.com/"), "test");
        },
        "shrink: if no Term is known the original IRI is returned": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-shrink-DOMString-DOMString-iri"
            var termMap = new TermMap({
                "test": "http://example.com/"
            }, "http://example.com/default#");

            assert.strictEqual(termMap.shrink("http://example.org/value"), "http://example.org/value");
        },
        "setDefault: Sets the iri to be used when resolving term that is not defined": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-setDefault-void-DOMString-iri"
            var termMap = new TermMap({
                "test": "http://example.com/"
            }, "http://example.com/default#");

            assert.strictEqual(termMap.resolve("test2"), "http://example.com/default#test2");
            termMap.setDefault("http://example.org/default#");
            assert.strictEqual(termMap.resolve("test2"), "http://example.org/default#test2");
        },
        "addAll: Adds all Terms from one Term map into this map, override = false": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-addAll-TermmMap-TermMap-terms-boolean-override"
            var termMap = new TermMap({
                "test": "http://example.com/"
            }, "http://example.com/default#");

            var more = new TermMap({
                "test": "http://example.com/override",
                "test2": "http://example.com/test2"
            }, "http://example.com/default#new");
            termMap.addAll(more, false);
            assert.strictEqual(termMap.get("test"), "http://example.com/");
            assert.strictEqual(termMap.get("test2"), "http://example.com/test2");
            assert.strictEqual(termMap.getDefault(), "http://example.com/default#");
        },
        "addAll: Adds all Terms from one Term map into this map, override = true": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-addAll-TermmMap-TermMap-terms-boolean-override"
            var termMap = new TermMap({
                "test": "http://example.com/"
            }, "http://example.com/default#");

            var more = new TermMap({
                "test": "http://example.com/override",
                "test2": "http://example.com/test2"
            }, "http://example.com/default#new");
            termMap.addAll(more, true);
            assert.strictEqual(termMap.get("test"), "http://example.com/override");
            assert.strictEqual(termMap.get("test2"), "http://example.com/test2");
            assert.strictEqual(termMap.getDefault(), "http://example.com/default#new");
        }
    });
});