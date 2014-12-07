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
 * @module jazzHands.query.match.QuadPattern
 */
define([
    "dojo/_base/declare",
    "jazzHands/query/Quad",
    "dojo/Stateful"
], function (declare, Quad, Stateful) {
    /**
     * Used to form a Quad from a DataRow and variables
     * @description a Quad is a Triple with addition Graph information.  When the query is complete
     * the generated Quad will be either returned to the caller as-is, or added to the input data store
     * with the Graph name that was generated here
     * @class jazzHands.query.match.QuadPattern
     */
    return declare([Stateful], {
        /** @property {jazzHands.query.Variable | RdfJs.node.Named | RdfJs.node.Blank} */
        subject:null,
        /** @property {jazzHands.query.Variable | RdfJs.node.Named} */
        predicate:null,
        /** @property {jazzHands.rdf.Node} */
        object:null,
        /** @property {jazzHands.query.Variable | RdfJs.node.Named} */
        graph:null,
        /**
         * @public
         * @param {jazzHands.query.DataRow} dataRow - The DataRow to use to fill this Pattern
         * @return {Quad} - A Quad with the VariableNodes replaced with values from the input DataRow
         */
        match: function(dataRow){
            return new Quad({
                subject:this._resolve(this.subject, dataRow),
                predicate:this._resolve(this.predicate, dataRow),
                object:this._resolve(this.object, dataRow),
                graph:this._resolve(this.graph, dataRow)
            });
        },
        _resolve:function(node, row) {
            if (node.interfaceName === "Variable"){
                return node.resolve(row);
            }
            return node;
        }
    });
});