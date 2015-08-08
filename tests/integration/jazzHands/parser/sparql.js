/**
 * Created by Akeron on 3/8/14.
 */
define([
    "qasht/package/w3c",
    "jazzHands/parser/sparql",
    "blocks/promise/when",
    "blocks/promise/all",
    "RdfJs/TripleStore",
    "jazzHands/parser/turtle"
], function (TestPackage, sparql, when, all, TripleStore, TurtleParser) {
    function happyQueryTest(test) {
        test.shouldPass = true;
        return queryTest(test);
    }

    function sadSyntaxTest(test) {
        test.shouldPass = false;
        return syntaxTest(test);
    }

    function happySyntaxTest(test) {
        test.shouldPass = true;
        return syntaxTest(test);
    }

    var pkg = TestPackage({
        prefix: {
            "qt": "http://www.w3.org/2001/sw/DataAccess/tests/test-query#",
            "ut":"http://www.w3.org/2009/sparql/tests/test-update#"
        },
        module: "jazzHands/parser/sparql",
        manifest: "jazzHands/test/integration/parser/sparql11-test-suite/manifest-all.ttl",
        "mf:UpdateEvaluationTest": function (testDef, params, getFile) {
            return updateTest(testDef, params, getFile, true);
        },
        "mf:CSVResultFormatTest": happyQueryTest,
        "mf:QueryEvaluationTest": happyQueryTest,
        "mf:NegativeSyntaxTest11": sadSyntaxTest,
        "mf:NegativeUpdateSyntaxTest11": sadSyntaxTest,
        "mf:PositiveSyntaxTest11": happySyntaxTest,
        "mf:PositiveUpdateSyntaxTest11": happySyntaxTest,
        //exclude: function(test){
        //    return !test.equals("http://www.w3.org/2009/sparql/docs/tests/data-sparql11/csv-tsv-res/manifest#csv02");
        //},
        //debugId: {
        //    "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/csv-tsv-res/manifest#csv02>":true
        //},
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

    function compareResultset(test, expected, actual) {
        var bMap = {};

        function compbNode(exp, act) {
            var mapped = bMap[exp];
            if (mapped) {
                return act == mapped;
            }
            bMap[exp] = act;

            return exp.indexOf("_:") === 0; //just validate that we expeced a bNode and found one
        }

        function compare(exp, act) {
            if (exp == null || act == null) {
                return exp === act;
            }

            if (act.interfaceName == "BlankNode") {
                return compbNode(exp.toNT(), actRes[c].toNT());
            }

            return exp.equals(act);
        }

        if (expected) {
            test.assertEqual(expected.length, actual.length);

            for (var idx = 0; idx < actual.length; idx++) {
                var actRes = actual[idx];
                var expRes, c;

                var keys = Object.keys(actRes);
                if (test.bOrdered) {
                    expRes = expected[idx];

                    test.assertEqual(keys.length, Object.keys(expRes).length);
                    for (var cIdx = 0; cIdx < keys.length; cIdx++) {
                        c = keys[cIdx];
                        test.assertTrue(compare(expRes[c], actRes[c]), "Nodes are equal");
                    }

                } else {
                    var bMatch = false;
                    for (var eIdx = 0; eIdx < expected.length; eIdx++) {
                        expRes = expected[eIdx];
                        bMatch = expRes != null &&
                            keys.length == Object.keys(expRes).length;

                        var kIdx = 0;
                        while (bMatch && kIdx < keys.length) {
                            c = keys[kIdx];
                            bMatch = compare(expRes[c], actRes[c]);

                            kIdx++;
                        }
                        if (bMatch) {
                            expected[eIdx] = null;
                            break;
                        }
                    }

                    test.assertTrue(bMatch, "Matching record was found");
                }
            }
        } else {
            test.assertEqual(expected, actual);
        }
    }

    function queryTest(test){
        test.setUp = function(test){
            test.store = new TripleStore();

            var loading = test.get("mf:action").map(function(action){
                action.loadText = test.loadText;
                var qDef = action.loadText("qt:query", function(data){
                    test.query = data;
                });

                var dDef = action.loadText("qt:data", function(data){
                    test.store.addAll((new TurtleParser()).parse(data));
                });

                return all(qDef, dDef);
            });

            var lResult = test.loadText("mf:result", function(data){
                test.store.addAll((new TurtleParser()).parse(data));
            });

            loading.push(lResult);
            return all(loading);
        };
        test.exec = function(test){
            return when(sparql(test.sparql, { store: test.data }), function (results) {
                compareResultset(test, test.expected, results);

                test.complete();
            });
        };
    }
/*
    function loadData(data, ext, store, graphName) {
        var fileName;

        var out = { };
        switch (ext) {
            case "ttl":
                return when((new TurtleParser()).parse(data), function (rdf) {
                    store.addAll(rdf, graphName || "DEFAULT");

                    out.format = "rdf";
                    out.data = rdf;
                    return out;
                });
                break;
            case "srx":
                out.format = "xml";
                out.data = xmlParser.parse(data);
                break;
            case "csv":
                var rows = data.split("\r\n");
                var cols = [];
                out.data = [];
                for (var rIdx = 0; rIdx < rows.length; rIdx++) {
                    if (rows[rIdx].length > 0) {
                        var data = rows[rIdx].split(",");
                        if (rIdx == 0) {
                            cols = data;
                        } else {
                            var row = {}, bQuote = false;
                            for (var cIdx = 0, valIdx = 0; cIdx < cols.length; cIdx++) {
                                var val = (data[cIdx].length > 0) ? data[valIdx] : null;
                                bQuote = val && val[0] === "\"";
                                if (bQuote) {
                                    do {
                                        val = val + "," + data[++valIdx];
                                    } while (data[valIdx] && val.substr(-1) != "\"");
                                    row[cols[cIdx]] = val.substring(1, val.length - 1);
                                } else {
                                    valIdx++;
                                    row[cols[cIdx]] = val;
                                }
                            }
                            out.data.push(row);
                        }
                    }
                }
                out.format = "csv";

        }
        return out;
    }

    function updateTest(def) {
        def.setUp = function (test) {
            var defList = [];

            test.after = new TripleStore();
            test.sparql = [];
            var store = new TripleStore();
            test.before = store;
            var action = test.get("mf:action")[0];
            action.loadText = test.loadText;

            var lData = action.loadText("ut:data", function(data, name){
                return loadData(data, name.split(".")[1], store)
            });
            var lGraph = action.loadText("ut:graphData", function(data){
                return loadData(data, name.split(".")[1], store)
            });
            var lRequest = action.loadText("ut:request", function(data){
                return loadData(data, name.split(".")[1], store, function (query) {
                    test.sparql = query[0].data;
                });
            });

            var result = test.get("mf:result")[0];
            result.loadText = test.loadText;
            var lrData = result.loadText("ut:data", function(data){
                return loadData(data, name.split(".")[1], store)
            });
            var lrGraph = result.loadText("ut:graphData", function(data){
                return loadData(data, name.split(".")[1], store)
            });

            return all([lData, lGraph, lRequest, lrData, lrGraph]);
        };
        def.execTest = function () {
            var test = this;
            try {
                return when(execQuery(test.sparql, test.before), function () {
                    compareStores(test, test.before, test.after);
                    test.complete();
                }, function (failMsg) {
                    test.assertFalse(shouldPass, failMsg.message);
                    test.complete();
                });
            } catch (err) {
                test.assertFalse(shouldPass, err.message);
                test.complete();
            }
        };
    }

    function execQuery(sQuery, store) {
        return when(sparqlParser.parse(sQuery), function (sqgm) {
            if (sqgm) {
                if (sqgm.failed) {
                    throw sqgm;
                }
                return sqgm.execute(store);
            }
            return null;
        });
    }

    function compareStores(test, before, after) {
        var graphs = Object.keys(after._graph);
        test.assertEqual(Object.keys(before._graph).length, graphs.length);
        Object.keys(after._graph).forEach(function (graph) {
            compareGraph(test, before._graph[graph], after._graph[graph]);
        });
    }

    function renderStores(exp, act) {
        var out = "Expected:\n";
        out += renderStore(exp);
        out += "Actual:\n";
        return out + renderStore(act) + "\n\n";
    }

    function renderStore(store) {
        var graphs = Object.keys(store._graph);
        var out = "";
        graphs.forEach(function (g) {
            out += "Graph <" + g + ">:\n";
            store._graph[g]._triples.join("\n");
            out += "\n\n";
        });
        return out + "\n\n";
    }

    function renderResults(exp, act) {
        var out = "Expected:\n";
        out += renderResult(exp);
        out += "Actual:\n";
        return out + renderResult(act) + "\n\n";
    }

    function renderResult(results) {
        var columns = {};
        var rows = [];
        results.forEach(function (row) {
            if (!row) {
                return;
            }
            var keys = Object.keys(row);
            var rDef = {};
            keys.forEach(function (column) {
                var cDef = columns[column] || { length: column.length };
                rDef[column] = row[column].toNT();

                var length = rDef[column].length;
                if (length > cDef.length) {
                    cDef.length = length;
                }
            });
            rows.push(rDef);
        });

        function align(len, target) {
            if (len < target) {
                return new Array(target - len).join(' ');
            }
            return "";
        }

        var col = Object.keys(columns);
        var out = " | ";
        col.forEach(function (c) {
            out += c + align(c.length, columns[c].length) + " | ";
        });
        out += "\n";

        rows.forEach(function (row) {
            out += " | ";
            col.forEach(function (c) {
                var length = 0;
                if (row[c]) {
                    out += row[c];
                    length = row[c].length;
                }
                out += align(length, columns[c].length) + " | ";
            });
            out += "\n";
        });

        return out + "\n\n";
    }

    function compareGraph(test, actual, expected) {
        test.assertTrue(actual != null);
        test.assertTrue(expected != null);

        test.assertEqual(actual.length, expected.length);
        expected.forEach(function (triple) {
            test.assertEqual(1, actual.match(triple.subject.toNT(), triple.predicate.toNT(), triple.object.toNT()).length);
        });
        actual.forEach(function (triple) {
            test.assertEqual(1, expected.match(triple.subject.toNT(), triple.predicate.toNT(), triple.object.toNT()).length);
        });
        /*
         Object.keys(expected._indexes).forEach(function(s){
         test.assertTrue(actual.spo[s] != null);
         Object.keys(expected.spo[s]).forEach(function(p){
         test.assertTrue(actual.spo[s][p] != null);
         Object.keys(expected.spo[s][p]).forEach(function(o){
         test.assertTrue(actual.spo[s][p][o] != null);

         var exp = expected._triples[expected.spo[s][p][o]];
         var act = actual._triples[actual.spo[s][p][o]];

         test.assertEqual(exp.subject.toNT(), act.subject.toNT());
         test.assertEqual(exp.predicate.toNT(), act.predicate.toNT());
         test.assertEqual(exp.object.toNT(), act.object.toNT());
         });
         });
         });*
    }

    function compareResultset(test, expected, actual) {
        var bMap = {};

        function compbNode(exp, act) {
            var mapped = bMap[exp];
            if (mapped) {
                return act == mapped;
            }
            bMap[exp] = act;

            return exp.indexOf("_:") === 0; //just validate that we expeced a bNode and found one
        }

        function compare(exp, act) {
            if (exp == null || act == null) {
                return exp === act;
            }

            if (lang.isObject(exp)) {
                if (act.interfaceName == "BlankNode") {
                    return compbNode(exp.toNT(), actRes[c].toNT());
                }

                return exp.equals(act);
            }

            if (exp.indexOf("_:") === 0) {
                return compbNode(exp, actRes[c][test.mode]());
            }
            return exp == act[test.mode]();
        }

        if (lang.isObject(expected)) {
            test.assertEqual(expected.length, actual.length);
            for (var idx = 0; idx < actual.length; idx++) {
                var actRes = actual[idx];
                var expRes, c;

                var keys = Object.keys(actRes);
                if (test.bOrdered) {
                    expRes = expected[idx];

                    test.assertEqual(keys.length, Object.keys(expRes).length);
                    for (var cIdx = 0; cIdx < keys.length; cIdx++) {
                        c = keys[cIdx];
                        test.assertTrue(compare(expRes[c], actRes[c]), "Nodes are equal");
                    }

                } else {
                    var bMatch = false;
                    for (var eIdx = 0; eIdx < expected.length; eIdx++) {
                        expRes = expected[eIdx];
                        bMatch = expRes != null &&
                            keys.length == Object.keys(expRes).length;

                        var kIdx = 0;
                        while (bMatch && kIdx < keys.length) {
                            c = keys[kIdx];
                            bMatch = compare(expRes[c], actRes[c]);

                            kIdx++;
                        }
                        if (bMatch) {
                            expected[eIdx] = null;
                            break;
                        }
                    }

                    test.assertTrue(bMatch, "Matching record was found");
                }
            }
        } else {
            test.assertEqual(expected, actual);
        }
    }

    function queryTest(def, p, getFile) {
        def.setUp = function (test) {
            test.after = new TripleStore;
            test.sparql = [];
            var store = new TripleStore();
            test.before = store;
            var action = test.get("mf:action")[0];
            action.loadText = test.loadText;

            var lData = action.loadText("qt:data", function(data, name){
                return loadData(data, name.split(".")[1], store)
            });
            var lGraph = action.loadText("qt:graphData", function(data){
                return loadData(data, name.split(".")[1], store)
            });
            var lRequest = action.loadText("qt:query", function(data){
                return loadData(data, name.split(".")[1], store, function (query) {
                    test.sparql = query[0].data;
                });
            });

            var result = test.get("mf:result")[0];
            result.loadText = test.loadText;
            var lrData = test.loadText("mf:result", function(data){
                return loadData(data, name.split(".")[1], store);
                switch (info.format) {
                    case "xml":
                        loadXmlResults(test, info);
                        break;
                    case "rdf":
                        loadRdfResults(test, info);
                        break;
                    case "csv":
                    case "tsv":
                        loadCsvResults(test, info);
                        break;
                }
            });

            return all([lData, lGraph, lRequest, lrData]);
        };

        def.execTest = function () {
        };
    }

    function loadXmlResults(test, info) {
        var xml = info.data, idx;
        var v = xml.byName("variable");
        var results = xml.byName("result");
        if (v.length > 0 || results.length > 0) {
            var rowTemplate = {};
            v.forEach(function (col) {
                rowTemplate[col.getAttribute("name")] = null;
            });

            results.forEach(function (result) {
                var row = lang.clone(rowTemplate);
                test.results.push(row);
                result.byName("binding").forEach(function (bind) {
                    var node = null;
                    var col = bind.getAttribute("name");
                    for (idx = 0; idx < bind.childNodes.length; idx++) {
                        var xmlNode = bind.childNodes[idx];
                        switch (xmlNode.nodeName) {
                            case "literal":
                                node = new lNode(xmlNode.childNodes[0].nodeValue, xmlNode.getAttribute("language"), xmlNode.getAttribute("datatype"));
                                break;
                            case "uri":
                                node = new nNode(xmlNode.childNodes[0].nodeValue);
                                break;
                            case "bnode":
                                node = new bNode(xmlNode.childNodes[0].nodeValue);
                                break;
                        }

                        if (node != null) {
                            break;
                        }
                    }
                    row[col] = node;
                });
            });
        } else {
            var res = xml.byName("boolean");
            if (res.length > 0) {
                test.results = res[0].childNodes[0].nodeValue === "true";
            }
        }
        test.bOrdered = false;
        test.mode = "toNT";
        test.resultFormat = "NodeArray";
    }

    function loadRdfResults(test, info) {
        test.results = new Graph();
        test.results.addAll(info.data);
        test.resultFormat = "TripleStore";
    }

    function loadCsvResults(test, info) {
        test.results = info.data;
        if (info.format == "csv") {
            test.mode = "valueOf";
        } else {
            info.mode = "toNT";
        }
        test.resultFormat = "StringArray";
        test.ordered = false;
        //test.resultFormat = "stringMatch";
    }

    function syntaxTest(def, p, getFile, shouldPass) {
        def.setUp = function () {
            var defList = [];
            var test = this;
            test.after = new TripleStore;
            test.sparql = [];
            var store = new TripleStore();

            var action = def["mf:action"];//[idx];
            test.before = store;

            defList.push(when(loadData(action, store, "qt", getFile), function (query) {
                test.sparql = query[0].data;
            }));


            return all(defList);
        };

        def.execTest = function () {
            var test = this;
            try {
                return when(sparqlParser.parse(test.sparql), function (sqgm) {
                    test.assertTrue(lang.isObject(sqgm), "Query Plan returned");
                    test.assertEqual(!shouldPass, sqgm.failed || false, "Query Parsing success");
                    test.complete();
                }, function (failMsg) {
                    test.assertTrue(shouldPass, failMsg.message);
                    test.complete();
                });
            } catch (err) {
                test.assertTrue(shouldPass, err.message);
                test.complete();
            }
        };
    }*/
    pkg.excludeById = {
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/add/manifest#add01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/add/manifest#add02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/add/manifest#add03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/add/manifest#add04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/add/manifest#add05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/add/manifest#add06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/add/manifest#add07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/add/manifest#add08>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg08>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg08b>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg09>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg10>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg11>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg12>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-groupconcat-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-groupconcat-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-groupconcat-03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-sum-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-sum-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-avg-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-avg-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-min-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-min-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-max-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-max-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-sample-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-err-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-err-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/aggregates/manifest#agg-empty-group>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-data-spo1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-data-spo-named1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-data-spo-named2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-data-spo-named3>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-where-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-where-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-where-03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-where-04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-using-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-05a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-data-same-bnode>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-where-same-bnode>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/basic-update/manifest#insert-where-same-bnode2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bind/manifest#bind01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bind/manifest#bind02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bind/manifest#bind03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bind/manifest#bind04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bind/manifest#bind05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bind/manifest#bind06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bind/manifest#bind07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bind/manifest#bind08>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bind/manifest#bind10>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bind/manifest#bind11>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bindings/manifest#values1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bindings/manifest#values2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bindings/manifest#values3>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bindings/manifest#values4>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bindings/manifest#values5>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bindings/manifest#values6>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bindings/manifest#values7>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bindings/manifest#values8>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bindings/manifest#inline1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/bindings/manifest#inline2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/clear/manifest#dawg-clear-default-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/clear/manifest#dawg-clear-graph-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/clear/manifest#dawg-clear-named-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/clear/manifest#dawg-clear-all-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/construct/manifest#constructwhere01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/construct/manifest#constructwhere02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/construct/manifest#constructwhere03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/construct/manifest#constructwhere04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/construct/manifest#constructwhere05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/construct/manifest#constructwhere06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/copy/manifest#copy01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/copy/manifest#copy02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/copy/manifest#copy03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/copy/manifest#copy04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/copy/manifest#copy06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/copy/manifest#copy07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/csv-tsv-res/manifest#csv01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/csv-tsv-res/manifest#tsv01>":true,
        "rg/2009/sparql/docs/tests/data-sparql11/csv-tsv-res/manifest#csv02> cvs02 - CSV Result Format":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/csv-tsv-res/manifest#tsv02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/csv-tsv-res/manifest#csv03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/csv-tsv-res/manifest#tsv03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/drop/manifest#dawg-drop-default-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/drop/manifest#dawg-drop-graph-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/drop/manifest#dawg-drop-named-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/drop/manifest#dawg-drop-all-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/exists/manifest#exists01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/exists/manifest#exists02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/exists/manifest#exists03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/exists/manifest#exists04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/exists/manifest#exists05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-where/manifest#dawg-delete-where-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-where/manifest#dawg-delete-where-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-where/manifest#dawg-delete-where-03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-where/manifest#dawg-delete-where-04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-where/manifest#dawg-delete-where-05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-where/manifest#dawg-delete-where-06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-data/manifest#dawg-delete-data-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-data/manifest#dawg-delete-data-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-data/manifest#dawg-delete-data-03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-data/manifest#dawg-delete-data-04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-data/manifest#dawg-delete-data-05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-data/manifest#dawg-delete-data-06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-with-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-with-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-with-03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-with-04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-with-05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-with-06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-using-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-using-02a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-using-03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-using-04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-using-05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete/manifest#dawg-delete-using-06a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdf01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdf02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdf03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdf04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs08>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs09>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs10>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs11>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs12>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#rdfs13>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#d-ent-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#owlds01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#owlds02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#paper-sparqldl-Q1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#paper-sparqldl-Q1-rdfs>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#paper-sparqldl-Q2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#paper-sparqldl-Q3>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#paper-sparqldl-Q4>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#paper-sparqldl-Q5>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#plainLit>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#bind01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#bind02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#bind03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#bind04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#bind05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#bind06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#bind07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#bind08>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-08>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-09>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-10>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-11>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-12>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#sparqldl-13>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#lang>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#parent2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#parent3>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#parent4>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#parent5>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#parent6>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#parent7>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#parent8>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#parent9>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#parent10>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#simple1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#simple2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#simple3>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#simple4>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#simple5>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#simple6>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#simple7>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/entailment/manifest#simple8>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-01b>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-01c>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-03b>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-04b>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-05b>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-06b>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-07b>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-08>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/delete-insert/manifest#dawg-delete-insert-09>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_3>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_4>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_5>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_6>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_7>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_8>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_9>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_10>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_11>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_12>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_13>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_14>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_15>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_16>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_17>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_18>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_19>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_20>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_21>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_22>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_23>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_24>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_25>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_26>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_27>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_28>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_29>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_30>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_31>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_32>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_33>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_34>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_35a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_36a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_38a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_40>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_41>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_42>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_43>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_44>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_45>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_46>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_47>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_48>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_49>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_50>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_51>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_53>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_54>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_55>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_56>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_57>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_58>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_59>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_60>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_61a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_62a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_63>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_64>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_65>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_66>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_08>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_09>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_08>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_09>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_10>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_11>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_12>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pn_bad_13>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-query/manifest#test_pp_coll>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery08>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery09>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery10>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery11>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery12>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery13>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/subquery/manifest#subquery14>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/service/manifest#service1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/service/manifest#service2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/service/manifest#service3>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/service/manifest#service4a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/service/manifest#service5>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/service/manifest#service6>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/service/manifest#service7>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp08>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp09>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp10>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp11>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp12>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp14>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp16>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp21>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp23>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp25>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp28a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp30>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp31>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp32>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp33>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp34>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp35>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp36>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/property-path/manifest#pp37>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/project-expression/manifest#projexp01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/project-expression/manifest#projexp02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/project-expression/manifest#projexp03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/project-expression/manifest#projexp04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/project-expression/manifest#projexp05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/project-expression/manifest#projexp06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/project-expression/manifest#projexp07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-2/manifest#syntax-update-other-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#load-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#load-into-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#clear-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#clear-default-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#create-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#drop-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#drop-default-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#copy-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#copy-to-default-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#move-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#move-to-default-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#add-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/update-silent/manifest#add-to-default-silent>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/negation/manifest#subset-by-exclusion-nex-1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/negation/manifest#subset-by-exclusion-minus-1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/negation/manifest#temporal-proximity-by-exclusion-nex-1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/negation/manifest#subset-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/negation/manifest#subset-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/negation/manifest#set-equals-1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/negation/manifest#subset-03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/negation/manifest#exists-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/negation/manifest#exists-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/negation/manifest#full-minuend>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/negation/manifest#partial-minuend>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-fed/manifest#test_1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-fed/manifest#test_2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-fed/manifest#test_3>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/service-description/manifest#has-endpoint-triple>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/service-description/manifest#returns-rdf>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/service-description/manifest#conforms-to-schema>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_post_form>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_dataset_default_graphs_get>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_dataset_default_graphs_post>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_dataset_named_graphs_post>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_dataset_named_graphs_get>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_dataset_full>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_multiple_dataset>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_get>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_content_type_select>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_content_type_ask>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_content_type_describe>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_content_type_construct>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#update_dataset_default_graph>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#update_dataset_default_graphs>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#update_dataset_named_graphs>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#update_dataset_full>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#update_post_form>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#update_post_direct>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#update_base_uri>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#query_post_direct>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_query_method>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_multiple_queries>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_query_wrong_media_type>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_query_missing_form_type>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_query_missing_direct_type>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_query_non_utf8>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_query_syntax>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_update_get>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_multiple_updates>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_update_wrong_media_type>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_update_missing_form_type>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_update_non_utf8>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_update_syntax>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/protocol/manifest#bad_update_dataset_conflict>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_3>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_4>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_5>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_6>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_7>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_8>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_9>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_10>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_11>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_12>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_13>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_14>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_15>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_16>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_17>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_18>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_19>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_20>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_21>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_22>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_23>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_24>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_25>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_26>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_27>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_28>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_29>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_30>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_31>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_32>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_33>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_34>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_35>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_36>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_37>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_38>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_39>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_40>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_41>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_42>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_43>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_44>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_45>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_46>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_47>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_48>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_49>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_50>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_51>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_52>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_53>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/syntax-update-1/manifest#test_54>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/move/manifest#move01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/move/manifest#move02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/move/manifest#move03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/move/manifest#move04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/move/manifest#move06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/move/manifest#move07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/grouping/manifest#group01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/grouping/manifest#group03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/grouping/manifest#group04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/grouping/manifest#group05>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/grouping/manifest#group06>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/grouping/manifest#group07>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/json-res/manifest#jsonres01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/json-res/manifest#jsonres02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/json-res/manifest#jsonres03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/json-res/manifest#jsonres04>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#strdt01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#strdt02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#strdt03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#strlang01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#strlang02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#strlang03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#isnumeric01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#abs01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#ceil01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#floor01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#round01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#concat01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#concat02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#substring01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#substring02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#length01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#ucase01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#lcase01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#encode01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#contains01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#starts01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#ends01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#plus-1>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#plus-2>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#md5-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#md5-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#sha1-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#sha1-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#sha256-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#sha256-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#sha512-01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#sha512-02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#minutes>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#seconds>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#hours>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#month>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#year>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#day>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#timezone>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#tz>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#bnode01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#bnode02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#in01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#in02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#notin01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#notin02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#now01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#rand01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#iri01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#if01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#if02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#coalesce01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#strbefore01a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#strbefore02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#strafter01a>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#strafter02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#replace01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#replace02>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#replace03>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#uuid01>":true,
        "<http://www.w3.org/2009/sparql/docs/tests/data-sparql11/functions/manifest#struuid01>":true
    };

    return pkg;
});