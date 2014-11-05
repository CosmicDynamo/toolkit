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
    "jazzHands/query/DataRow",
    "RdfJs/test/fake/Node"
], function (TestPackage, DataRow, Node) {
    return new TestPackage({
        module: "jazzHands/query/DataRow",
        tests: [
            {
                name: "get/set: Able to set a value on the Row and re-get it",
                exec: function (test) {
                    var value = new Node("<urn:sample>");

                    test.assertNull(test.dataRow.get("col"), "Column does not have a value before it is set");

                    test.dataRow.set("col", value);

                    test.assertEqual(value, test.dataRow.get("col"), "Column is now set to new value");

                    test.complete();
                }
            },
            {
                name: "columns: returns the list of columns on this row",
                exec: function (test) {
                    test.assertEqual(0, test.dataRow.columns().length, "Returns empty array before data is added");

                    test.dataRow.set("aColumn1", new Node("<urn:value"));
                    test.dataRow.set("aColumn2", new Node("<urn:value"));
                    test.dataRow.set("aColumn3", new Node("<urn:value"));
                    test.dataRow.set("aColumn4", new Node("<urn:value"));
                    test.dataRow.set("aColumn4", new Node("<urn:SetAgain"));

                    var columns = test.dataRow.columns();

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
            }
        ],
        setUp: function (test) {
            test.dataRow = new DataRow();
        },
        tearDown: function (test) {
        }
    });
});