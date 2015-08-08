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
 * @module jazzHands.test.unit.query.DataRow
 */
define([
    "qasht/package/Unit",
    "jazzHands/query/DataSet",
    "RdfJs/test/fake/Node",
    "jazzHands/test/api/query/DataSet",
    "jazzHands/test/api/query/DataRow",
    "jazzHands/query/DataRow"
], function (TestPackage, DataSet, Node, testSetApi, testRowApi, DataRow) {
    return new TestPackage({
        module: "jazzHands/query/DataSet",
        tests: [
            {
                name: "API",
                exec: function (test) {
                    testSetApi(test.dataSet, test);

                    test.complete();
                }
            },
            {
                name: "add: Adds a row to this set and returns it",
                exec: function (test) {
                    test.assertEqual(0, test.dataSet.length);

                    var row = test.dataSet.add();

                    testRowApi(row, test);

                    test.assertEqual(1, test.dataSet.length);

                    test.dataSet.forEach(function (actual) {
                        test.assertEqual(row, actual);
                    });

                    test.complete();
                }
            },
            {
                name: "add: Takes and existing row and adds it to this set",
                exec: function (test) {
                    test.assertEqual(0, test.dataSet.length);

                    var row = new DataRow();
                    row.set("column", "value");

                    var rtn = test.dataSet.add(row);

                    test.assertEqual(row, rtn);

                    test.dataSet.forEach(function (actual) {
                        test.assertEqual(row, actual);
                    });

                    test.complete();
                }
            },
            {
                name: "columns: returns the list of columns on any row in this set",
                setUp: function (test) {
                    test.row1 = test.dataSet.add();
                    test.row2 = test.dataSet.add();
                    test.row3 = test.dataSet.add();
                    test.row4 = test.dataSet.add();

                    test.row1.set("aColumn1", new Node("<urn:value>"));
                    test.row2.set("aColumn2", new Node("<urn:value>"));
                    test.row3.set("aColumn3", new Node("<urn:value>"));
                    test.row4.set("aColumn4", new Node("<urn:value>"));

                    test.row1.set("aColumn4", new Node("<urn:SetAgain>"));
                },
                exec: function (test) {
                    var columns = test.dataSet.columns();

                    test.assertEqual(4, columns.length, "Four Columns were added");
                    var values = {};
                    columns.forEach(function (name) {
                        values[name] = true;
                    });

                    test.assertTrue(values["aColumn1"], "Expected Column Found");
                    test.assertTrue(values["aColumn2"], "Expected Column Found");
                    test.assertTrue(values["aColumn3"], "Expected Column Found");
                    test.assertTrue(values["aColumn4"], "Expected Column Found");

                    test.complete();
                }
            },
            {
                name: "forEach: will look through each row in the order it was added",
                setUp: function (test) {
                    test.rows = [];
                    test.rows.push(test.dataSet.add());
                    test.rows.push(test.dataSet.add());
                    test.rows.push(test.dataSet.add());
                    test.rows.push(test.dataSet.add());

                    test.rows[0].set("aColumn1", new Node("<urn:value>"));
                    test.rows[1].set("aColumn2", new Node("<urn:value>"));
                    test.rows[2].set("aColumn3", new Node("<urn:value>"));
                    test.rows[3].set("aColumn4", new Node("<urn:value>"));
                },
                exec: function (test) {
                    test.dataSet.forEach(function (actual, index) {
                        test.assertEqual(test.rows[index], actual);
                    });

                    test.complete();
                }
            }
        ],
        setUp: function (test) {
            test.dataSet = new DataSet();
        }
    });
});