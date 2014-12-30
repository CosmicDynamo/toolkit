/**
 * Created by Akeron on 3/8/14.
 */
define([
    "qasht/package/w3c",
    "jazzHands/parser/turtle",
    "blocks/promise/all",
    "RdfJs/Graph",
    "RdfJs/Triple",
    "RdfJs/test/unit/graph/compare",
    "RdfJs/test/api/Graph"
], function (TestPackage, Turtle, all, Graph, Triple, compare, testGraphApi) {
    new TestPackage({
        prefix: {"rdf-test": "http://www.w3.org/ns/rdftest#"},
        module: "jazzHands/parser/turtle",
        manifest: "jazzHands/test/integration/parser/turtle/manifest.ttl",
        'default': function (params) {
            params.setUp = this.testSetUp;
            params.loadResults = this.loadResults;
            params.exec = this.exec;
            params.syntax = this.positive;
            params.testDetails = this.testDetails;
        },
        debugId: {
            "<>": false
        },
        excludeById: {},
        "rdf-test:TestTurtleNegativeSyntax": function (params) {
            params.setUp = this.testSetUp;
            params.exec = this.negative;
            params.testDetails = this.testDetails;
        },
        "rdf-test:TestTurtleNegativeEval": function (params) {
            params.setUp = this.testSetUp;
            params.exec = this.negative;
            params.testDetails = this.testDetails;
        },
        "rdf-test:TestTurtlePositiveSyntax": function (params) {
            params.setUp = this.testSetUp;
            params.exec = this.positive;
            params.testDetails = this.testDetails;
        },
        testSetUp: function (test) {
            test.parser = new Turtle();
            var loadAction = test.loadText("mf:action", function(data, name){
                test.parser.setBase("http://www.w3.org/2013/TurtleTests" + name.substr(name.lastIndexOf("/")));
                test.data = data;
            });

            var loadResult = test.loadText("mf:result", function(data){
                test.expected = test.loadResults(data);
            });

            return all(loadAction.concat(loadResult));
        },
        loadResults: function (file) {
            var out = new Graph();
            var lines = file.split("\n");
            for (var ln = 0; ln < lines.length; ln++) {
                if (lines[ln].length > 0) {

                    var columns = lines[ln].split(" ");

                    if (columns.length >= 3) {
                        out.add(new Triple({
                            subject: columns[0],
                            predicate: columns[1],
                            object: columns.slice(2, columns.length - 1).join(" ")
                        }));
                    }
                }
            }

            return out;
        },
        exec: function (test) {
            try {
                test.syntax(test, function (actual) {
                    try {
                        test.assertTrue(compare(test.expected, actual));

                        test.complete();
                    } catch (err) {
                        test.assertFail(err.message);
                    }
                });
            } catch (ex) {
                test.assertFail(ex);
            }
        },
        positive: function (test, fn) {
            try {
                return test.whenResolved(test.parser.parse(test.data), function (results) {
                    if (fn) {
                        return fn(results);
                    }
                    testGraphApi(results, test);
                    test.complete();
                });
            } catch (err) {
                test.assertFail(err.message);
            }
        },
        negative: function (test) {
            try {
                test.whenRejected(test.parser.parse(test.data), function (err) {
                    test.assertTrue(err !== null, "Error was thrown");
                    test.complete();
                });
            } catch (err) {
                test.assertTrue(err !== null, "Error was thrown");
                test.complete();
            }
        },
        testDetails: function (test) {
            var out = [];
            out.push("Test IRI: " + test.toNT());

            out = out.concat(test.get("rdf:type").map(function(type){
                return "Test Type: " + type.toNT();
            }));

            out = out.concat(test.get("mf:action").map(function(file){
                return "Input File: " + file.toNT();
            }));

            out = out.concat(test.get("mf:result").map(function(file){
                return "Output File: " + file.toNT();
            }));

            return "\n" + out.join("\n") + "\n";
        }
    });
});