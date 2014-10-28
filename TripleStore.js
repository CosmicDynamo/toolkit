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
    "./Graph",
    "blocks/Container",
    "blocks/Exception"
], function (declare, lang, Graph, Container, Exception) {
    /**
     * @class RdfJs.TripleStore
     */
    return declare([], {
        /** @property {blocks.Container} The graphs stored in this sto*/
        _graphData: null,
        /** @property {String|String[]} - Default Graph(s) */
        _default: null,
        /** @constructs RdfJs.Graph */
        GraphCtor: null,
        constructor: function (args) {
            args = args || {};

            this.GraphCtor = args.GraphCtor || Graph;

            var defGraph = args.default || "urn:Default";
            this.setDefault(defGraph);

            this._graphData = new Container();
        },
        /**
         * Creates a new RDF Graph and adds it to the store
         * @param {String} name - Name of this new graph
         * @return {RdfJs.Graph}
         */
        addGraph: function (name) {
            if (name === "DEFAULT" || name === "ALL") {
                throw new Exception("Invalid Graph type");
            }
            var graph = new this.GraphCtor();

            this._graphData.set(name, graph);

            return graph;
        },
        /**
         * Executes a Method on the requested graphs
         * @param {Function} method - The method to execute
         * @param {String|String[]} graphs - The Graphs being executed against
         */
        runOnGraphs: function (method, graphs) {
            var store = this;
            graphs = graphs || "DEFAULT";
            if (!lang.isArray(graphs)) {
                graphs = [graphs];
            }

            var gNames = store._resolveGraphs(graphs);

            gNames.forEach(function (gName) {
                var graph = store.getGraph(gName) || store.addGraph(gName);
                method.apply(store, [graph]);
            });
        },
        /**
         * Takes a list of Graphs and returns a list of realized names
         * @description Removes duplicates to avoid redundant calls, as well as handling the DEFAULT and ALL keywords
         * @param {String[]} list - The list of desired names
         * @param {blocks.Container} [mix] - Hash of graph names used internally by _resolveGraphs
         * @returns {Array}
         * @private
         */
        _resolveGraphs: function (list, mix) {
            var store = this;
            var selected = mix || new Container();

            for (var idx = 0; idx < list.length; idx++) {
                var item = list[idx];
                if (item === "ALL") {
                    store._resolveGraphs(this._graphData.keys(), selected);
                } else if (item === "DEFAULT") {
                    store._resolveGraphs(store._default, selected);
                } else {
                    selected.set(item, true);
                }
            }

            return selected.keys();
        },
        /**
         * Sets the default graph(s)
         * @param {String|String[]} value - Name(s) of the graphs to use
         */
        setDefault: function (value) {
            if (!lang.isArray(value)) {
                value = [value];
            }
            this._default = value;
        },
        /**
         * Adds a Triple to the specified Graph
         * @param {RdfJs.Triple} triple - The Triple being added
         * @param {String|String[]} graphName - The target Graph name(s)
         */
        add: function (triple, graphName) {
            this.runOnGraphs(function (graph) {
                graph.add(triple);
            }, graphName);
        },
        /**
         * Adds all Triples from input Graph to the specified Graph
         * @param {RdfJs.Graph} graph - The graph being added
         * @param {String|String[]} graphName - The target Graph name(s)
         */
        addAll: function (graph, graphName) {
            this.runOnGraphs(function (destGraph) {
                destGraph.addAll(graph);
            }, graphName);
        },
        /**
         * Removes a Triple from the specified Graph
         * @param {RdfJs.Triple} triple - The Triple being removed
         * @param {String|String[]} graphName - The target Graph name(s)
         */
        remove: function (triple, graphName) {
            this.runOnGraphs(function (graph) {
                graph.remove(triple);
            }, graphName);
        },
        /**
         * Removes matching Triple(s) from the specified Graph
         * @param {String} [subject] - The NT form subject being searched for
         * @param {String} [predicate] - The NT form predicate being searched for
         * @param {String} [object] - The NT form object being searched for
         * @param {String|String[]} graphName - The target Graph name(s)
         */
        removeMatches: function (subject, predicate, object, graphName) {
            this.runOnGraphs(function (graph) {
                graph.removeMatches(subject, predicate, object);
            }, graphName);
        },
        /**
         * Returns an Array containing the Triples from all Graphs
         * @param {String|String[]} graphName - The target Graph name(s)
         * @return {RdfJs.Triple[]}
         */
        toArray: function (graphName) {
            var out = [];
            this.runOnGraphs(function (graph) {
                out = out.concat(graph.toArray());
            }, graphName);
            return out;
        },
        /**
         * Returns true if tFilter returns true for any Triple in the target Graph(s)
         * @param {RdfJs._TripleFilter} tFilter - Filter to run against the Graph
         * @param {String|String[]} graphName - The target Graph name(s)
         * @returns {Boolean}
         */
        some: function (tFilter, graphName) {
            var some = false;
            this.runOnGraphs(function (graph) {
                some = some || graph.some(tFilter);
            }, graphName);
            return some;
        },
        /**
         * Returns true if tFilter returns true for every Triple in the target Graph(s)
         * @param {RdfJs._TripleFilter} tFilter - Filter to run against the Graph
         * @param {String|String[]} graphName - The target Graph name(s)
         * @returns {Boolean}
         */
        every: function (tFilter, graphName) {
            var every = true;
            this.runOnGraphs(function (graph) {
                every = every && graph.every(tFilter);
            }, graphName);
            return every;
        },
        /**
         * Returns A Graph containing the filtered Triples from the target Graph(s)
         * @param {RdfJs._TripleFilter} tFilter - Filter to run against the Graph
         * @param {String|String[]} graphName - The target Graph name(s)
         * @returns {RdfJs.Graph}
         */
        filter: function (tFilter, graphName) {
            var filtered = new this.GraphCtor();

            this.runOnGraphs(function (graph) {
                filtered.addAll(graph.filter(tFilter));
            }, graphName);
            return filtered;
        },
        /**
         * Runs the input function on the target Graph(s)
         * @param {RdfJs._TripleCallback} tCallback - Filter to run against the Graph
         * @param {String|String[]} graphName - The target Graph name(s)
         * @returns {RdfJs.Graph}
         */
        forEach: function (tCallback, graphName) {
            this.runOnGraphs(function (graph) {
                graph.forEach(tCallback);
            }, graphName);
        },
        /**
         * Returns A Graph containing the matched Triples from the target Graph(s)
         * @param {String} [subject] - The NT form subject being searched for
         * @param {String} [predicate] - The NT form predicate being searched for
         * @param {String} [object] - The NT form object being searched for
         * @param {String|String[]} graphName - The target Graph name(s)
         * @returns {RdfJs.Graph}
         */
        match: function (subject, predicate, object, graphName) {
            var matched = new this.GraphCtor();

            this.runOnGraphs(function (graph) {
                matched.addAll(graph.match(subject, predicate, object));
            }, graphName);
            return matched;
        },
        /**
         * Gets a Graph from the Store
         * @param {String} name - Name of the Graph to get
         * @returns {RdfJs.Graph}
         */
        getGraph: function (name) {
            return this._graphData.get(name);
        },
        /**
         * Removes a Graph from the Store
         * @param {String|String[]} name - the Graph(s) to remove
         */
        removeGraph: function (name) {
            var list = this._resolveGraphs(name);

            list.forEach(function (name) {
                this._graphData.remove(name);
            }.bind(this));
        }
    });
});