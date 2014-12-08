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
 * @module core.test.nit.HandlerHub
 */
define([
    "qasht/package/Unit",
    "core/HandlerHub",
    "RdfJs/test/fake/TripleStore",
    "RdfJs/test/fake/Graph",
    "RdfJs/Node"
], function (TestPackage, HandlerHub, TripleStore, Graph, Node) {
    return new TestPackage({
        module: "core/HandlerHub",
        tests: [
            {
                name: "handle: Will pull handler for input object's type IRI",
                setUp: function (test) {
                    var graph = test.app.store.getGraph("test", true);
                    graph.__addTriple({
                        subject: "<urn:Test>",
                        predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                        object: "<urn:Ctor>"
                    });
                },
                exec: function (test) {
                    var iri = new Node("<urn:Test>");
                    var options = { handleGraph: "test"};
                    test.whenResolved(test.app.hub.handle(iri, options), function(rtn){
                        test.assertIsObject(rtn, "Returned an Object");

                        test.assertEqual("HubTestClass", rtn.module);
                        test.assertEqual("handle", rtn.method);
                        test.assertEqual(iri, rtn.iri);
                        test.assertEqual(options, rtn.options);

                        test.complete();
                    });
                }
            },
            {
                name: "handle: handleGraph Can take Graph object",
                setUp: function (test) {
                    test.graph = new Graph({test: test});
                    test.graph.__addTriple({
                        subject: "<urn:Test>",
                        predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                        object: "<urn:Ctor>"
                    });
                },
                exec: function (test) {
                    var iri = new Node("<urn:Test>");
                    var options = { handleGraph: test.graph};
                    test.whenResolved(test.app.hub.handle(iri, options), function(rtn){
                        test.assertIsObject(rtn, "Returned an Object");

                        test.assertEqual("HubTestClass", rtn.module);
                        test.assertEqual("handle", rtn.method);
                        test.assertEqual(iri, rtn.iri);
                        test.assertEqual(options, rtn.options);

                        test.complete();
                    });
                }
            },
            {
                name: "Returns null if handler not found",
                setUp: function (test) {
                    test.graph = new Graph({test: test});
                    test.graph.__addTriple({
                        subject: "<urn:Test>",
                        predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                        object: "<urn:NoHandler>"
                    });
                },
                exec: function (test) {
                    var iri = new Node("<urn:Test>");
                    var options = { handleGraph: test.graph};

                    test.assertUndefined(test.app.hub.handle(iri, options));

                    test.complete();
                }
            },
            {
                name: "handleMethod: when set as a ctor will alter the method used to handle instructions",
                setUp: function(test){
                    test.app.hub = new HandlerHub({
                        configGraph: "config",
                        handleMethod: "alt"
                    });
                    test.app.hub.app = function(){
                        return test.app;
                    };
                    test.app.hub.loadConfig();

                    var graph = test.app.store.getGraph("test", true);
                    graph.__addTriple({
                        subject: "<urn:Test>",
                        predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                        object: "<urn:Ctor>"
                    });
                },
                exec: function (test) {
                    var iri = new Node("<urn:Test>");
                    var options = { handleGraph: "test"};
                    test.whenResolved(test.app.hub.alt(iri, options), function(rtn){
                        test.assertIsObject(rtn, "Returned an Object");

                        test.assertEqual("HubTestClass", rtn.module);
                        test.assertEqual("alt", rtn.method);
                        test.assertEqual(iri, rtn.iri);
                        test.assertEqual(options, rtn.options);

                        test.complete();
                    });
                }
            }
        ],
        setUp: function (test) {
            var app = {};
            app.hub = new HandlerHub({
                configGraph: "config"
            });
            app.hub.app = function(){
                return app;
            };

            app.store = new TripleStore({
                test: test,
                GraphCtor: function(args){
                    return new Graph(args, test);
                }
            });

            var graph = app.store.getGraph("config", true);

            var pres = function(term){
                return "<http://vocab.cosmicdynamo.net/presentation.owl#" + term + ">";
            };

            graph.__addTriple({subject:"_:0", predicate:"<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>", object:pres("Handler")});
            graph.__addTriple({subject:"_:0", predicate:pres("handlesType"), object:"<urn:Ctor>"});
            graph.__addTriple({subject:"_:0", predicate:pres("moduleId"), object:'"core/test/unit/resource/HubTestClass"'});

            app.hub.loadConfig();

            test.app = app;
        }
    });
});