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
 * @module $<class>$
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Stateful",
    "jazzHands/query/DataSet"
], function (declare, lang, Stateful, DataSet) {
    /**
     * @class $<class>$
     */
    return declare([Stateful], {
        /** @property {jazzHands.query.Variable | RdfJs.node.Named | RdfJs.node.Blank} */
        subject: null,
        /** @property {jazzHands.query.Variable | RdfJs.node.Named} */
        predicate: null,
        /** @property {jazzHands.rdf.Node} */
        object: null,
        run: function (dataRow, params) {
            var newSet = null;
            var setVar = this._setVariable;
            var subject = this._define(this.subject, dataRow);
            var predicate = this._define(this.predicate, dataRow);
            var object = this._define(this.object, dataRow);

            var newRows = params.graph.match(subject.toNT(), predicate.toNT(), object.toNT());
            if (newRows.length > 0) {
                newSet = new DataSet();

                newRows.forEach(function (triple) {
                    var newRow = dataRow.clone();

                    setVar(newRow, subject, triple.subject);
                    setVar(newRow, predicate, triple.predicate);
                    setVar(newRow, object, triple.object);

                    newSet.add(newRow);
                });
            }
            return newSet;
        },
        _setVariable: function (row, varNode, valNode) {
            if (varNode.interfaceName === "Variable") {
                row.set(varNode.valueOf(), valNode);
            }
            return row;
        },
        _define: function (variable, dataRow) {
            if (variable.interfaceName === "Variable") {
                return variable.resolve(dataRow) || variable;
            }
            return variable;

        }
    });
});