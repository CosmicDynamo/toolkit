/**
 * Created by Akeron on 3/8/14.
 */
define([
    "qasht/package/w3c/Unit",
    "jazzHands/parser/sparql",
    "dojo/when",
    "dojo/promise/all",
    "RdfJs/Graph",
    "RdfJs/Triple",
    "RdfJs/test/unit/graph/compare"
], function (TestPackage, sparql, when, all, Graph, Triple, compare) {
    new TestPackage({
        prefix: {"rdf-test": "http://www.w3.org/ns/rdftest#"},
        module: "jazzHands/parser/sparql",
        manifest: "jazzHands/test/unit/parser/sparql11-test-suite/manifest-all.ttl",
        'default': function (params) {
            params.setUp = this.testSetUp;
            params.loadResults = this.loadResults;
            params.exec = this.exec;
            params.syntax = this.positive;
            params.testDetails = this.testDetails;
        },
        exclude: function(ld){
            return ld["@id"] !== "http://www.w3.org/2009/sparql/docs/tests/data-sparql11/csv-tsv-res/manifest#csv02"
        },
        debugId: {
        },
        excludeById: {
        },
        testSetUp: function (test) {
            var action, result;

            action = when(test.getFile(test.action["@id"]), function (file) {
                //var name = test.action["@id"];
                //test.data = file;
            }.bind(this));

            if (test.result) {
                result = when(test.getFile(test.result["@id"]), function (file) {
                    //test.expected = this.loadResults(file);
                }.bind(this));
            }

            return all([action, result]);
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
                return test.whenResolved(sparql(test.data), function (results) {
                    if (fn) {
                        return fn(results);
                    }
                    test.complete();
                });
            } catch (err) {
                test.assertFail(err.message);
            }
        },
        negative: function (test) {
            try {
                test.whenRejected(sparql(test.data), function (err) {
                    test.assertTrue(err !== null, "Error was thrown");
                    test.complete();
                });
            } catch (err) {
                test.assertTrue(err !== null, "Error was thrown");
                test.complete();
            }
        },
        testDetails: function (test) {
            var out = "\n";
            out += "Test IRI: <" + test["@id"] + ">\n";
            out += "Test Type: " + test["@type"] + "\n";
            out += "Input File: " + test.action["@id"] + "\n";
            out += "Expected Output: " + (test.result ? (test.result["@id"]) : "<No Output File Specified>") + "\n";
            return out;
        }
    });
});