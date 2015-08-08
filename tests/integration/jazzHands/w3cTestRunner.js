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
 * @module tests.integration.jazzHands.w3cTestRunn
 */
define([
    "intern!object",
    "intern/main",
    "jazzHands/parser/turtle",
    "dojo/when",
    "dojo/_base/Deferred",
    "blocks/Cache",
    "RdfJs/PrefixMap",
    'RdfJs/Graph'
], function (intern, main, turtle, when, Deferred, Cache, PrefixMap, Graph) {
    var map = new PrefixMap();
    map.set("mf", "http://www.w3.org/2001/sw/DataAccess/tests/test-manifest#");
    map.set("qt", "http://www.w3.org/2001/sw/DataAccess/tests/test-query#");
    map.set("dawgt", "http://www.w3.org/2001/sw/DataAccess/tests/test-dawg#");
    map.set("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
    map.set("rdfs", "http://www.w3.org/2000/01/rdf-schema#");

    var rdfType = '<' + map.resolve("rdf:type") + '>';
    var rdfFirst = '<' + map.resolve("rdf:first") + '>';
    var rdfRest = '<' + map.resolve("rdf:rest") + '>';
    var rdfNil = '<' + map.resolve("rdf:nil") + '>';

    var rdfsComment = '<' + map.resolve("rdfs:comment") + '>';

    var mfName = '<' + map.resolve("mf:name") + ">";

    var loadTurtle = function(path){
        var done = new Deferred();

        require(["dojo/text!" + path], function (text) {
            when(turtle(text, {
                base: path
            }), done.resolve, done.reject);
        });

        return done;
    };
    var files = new Cache({
        load:loadTurtle
    });

    var addTestCase = function(suite, iri, graph, options){
        if (options.excludeById[iri.toString()]){
            return;
        }

        var testType = graph.match(iri.toNT(), rdfType, null).toArray()[0].object.valueOf();
        if (options.excludeByType[testType]) {
            return;
        }

        var name = graph.match(iri.toNT(), mfName, null).toArray()[0].object.valueOf();
        if (options.excludeByName[name]) {
            return;
        }

        var debug = options.debugName[name] || options.debugId[iri.toString()];
        //return when(toJsonld(this.tree(iri.toNT()), { context: this.context }), function(ld){
        var description = graph.match(iri.toNT(), rdfsComment, null).toArray()[0];
        if (description){
            name += " - " + description.object.valueOf();
        }

        if (debug) {
            console.log(iri.toString(), name);
            debugger;
        }

        var testRunner = options[testType] || options.default;

        if (!testRunner){
            console.error("No test runner defined for type: " + type);
        }

        suite[name] = function(){
            if (debug){
                debugger;
            }
            return testRunner.call(this, iri, graph, options)
        };
    };

    var loaded = {};
    var loadCt = 0;
    var startIntern = function(){
        if (--loadCt){
            return;
        }
        main.run();
    };

    var loadManifest = function(mid, options) {
        if (loaded[mid]){
            return null;
        }
        loadCt++;
        loaded[mid] = true;

        return when(files.get(mid), function(graph){
            var suite = {name: options.name + " - " + mid};
            graph.match(null, "<" + map.resolve("mf:entries") + ">", null).forEach(function (triple) {
                var rest = triple.object;
                do{
                    var first = graph.match(rest.toNT(), rdfFirst, null).toArray()[0];

                    addTestCase(suite, first.object, graph, options);

                    rest = graph.match(rest.toNT(), rdfRest, null).toArray()[0].object;
                } while (rest.toNT() !== rdfNil);
            });
            intern(suite);
            startIntern();

            var root = mid.substring(0, mid.lastIndexOf("/") + 1);

            graph.match(null, "<" + map.resolve("mf:include") + ">", null).forEach(function (triple) {
                var file = triple.object;

                return loadManifest(root + file.valueOf(), options);
            });
        });
    };

    var loadTests =  function(manifest, options){
        options = options || {};
        if (!manifest){
            return null;
        }

        if (options.prefix){
            Object.keys(this.prefix).forEach(function(pfx){
                loader.setPrefix(pfx, loader.prefix[pfx]);
            });
        }

        options.excludeByName = options.excludeByName || {};
        options.excludeById = options.excludeById || {};
        options.excludeByType = options.excludeByType || {};
        options.debugName = options.debugName || {};
        options.debugId = options.debugId || {};
        options.loaded = {};


        options.getFile = function(file, callback) {
            var done = new Deferred();
            require(["dojo/text!" + file], function(text) {
                var ready;
                if (callback){
                    ready = callback(text);
                }
                when(ready, done.resolve);
            });
            return done;
        };

        options.store = new Graph();

        loadManifest(manifest, options);
    };
    loadTests.prefixMap = map;

    return loadTests;
});