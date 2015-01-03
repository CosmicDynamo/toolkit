/**
 * @module RdfJs.Graph
 */
define([
    "blocks/HashTable",
    "./Triple",
    "dojo/_base/declare",
    "dojo/_base/lang"
], function (HashTable, Triple, declare, lang) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-Graph> */

    /**
     * @class RdfJs.Graph
     */
    var rdfGraph = declare([], {
        spo: null,
        _triples: null,
        TripleCtr: null,
        length: 0,
        actions: null,
        constructor: function (params) {
            lang.mixin(this, params);

            this.TripleCtr = this.TripleCtr || Triple;
            this._triples = new HashTable({
                genHash: function (t) {
                    return [t.s, t.o, t.p].join("-");
                }
            });
            this._node = new HashTable({
                genHash: function (node) {
                    return lang.isObject(node) ? node.toNT() : node;
                }
            });

            this.spo = {};

            this.actions = this.actions || [];
        },
        add: function (triple) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Graph-add-Graph-Triple-triple */
            this.actions.forEach(function (action) {
                action(triple);
            });

            return this._add(triple);
        },
        _add: function (triple) {
            var spo = this.spo;
            var s = this._node.add(triple.subject.toNT());
            var p = this._node.add(triple.predicate.toNT());
            var o = this._node.add(triple.object.toNT());

            if (!(s in spo) || !(p in spo[s]) || !(o in spo[s][p])) {
                var ptr = this._triples.add({ s: s, p: p, o: o });

                var n = -1;
                spo[s] = spo[s] || {};
                spo[n] = spo[n] || {};

                spo[s][p] = spo[s][p] || {};
                spo[n][p] = spo[n][p] || {};
                spo[s][n] = spo[s][n] || {};
                spo[n][n] = spo[n][n] || {};

                spo[s][p][o] = ptr;
                spo[n][p][o] = spo[n][p][o] || [];
                spo[n][p][o].push(ptr);
                spo[s][n][o] = spo[s][n][o] || [];
                spo[s][n][o].push(ptr);
                spo[s][p][n] = spo[s][p][n] || [];
                spo[s][p][n].push(ptr);

                spo[s][n][n] = spo[s][n][n] || [];
                spo[s][n][n].push(ptr);
                spo[n][n][o] = spo[n][n][o] || [];
                spo[n][n][o].push(ptr);
                spo[n][p][n] = spo[n][p][n] || [];
                spo[n][p][n].push(ptr);

                spo[n][n][n] = spo[n][n][n] || [];
                spo[n][n][n].push(ptr);
            }

            return this.onChange();
        },
        remove: function (triple) {
            this._remove(triple);

            return this.onChange();
        },
        removeMatches: function (s, p, o) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Graph-removeMatches-Graph-any-subject-any-predicate-any-object */
            var graph = this;

            this._match(s, p, o).forEach(function (ptr) {
                this._removeByPtr(ptr);
            }.bind(this));

            this.onChange();
            return graph;
        },
        _removeByPtr: function (tPtr) {
            var parts = this._triples.get(tPtr);
            var s = parts.s, p = parts.p, o = parts.o;
            var spo = this.spo;
            this._triples.remove(tPtr);

            delete spo[s][p][o];

            function rem(idx, arr) {
                var out = [];
                arr.forEach(function (val) {
                    if (val !== idx) {
                        out.push(val);
                    }
                });
                return out;
            }

            var n = -1;
            spo[n][p][o] = rem(tPtr, spo[n][p][o]);
            spo[s][n][o] = rem(tPtr, spo[s][n][o]);
            spo[s][p][n] = rem(tPtr, spo[s][p][n]);
            spo[s][n][n] = rem(tPtr, spo[s][n][n]);
            spo[n][p][n] = rem(tPtr, spo[n][p][n]);
            spo[n][n][o] = rem(tPtr, spo[n][n][o]);
            spo[n][n][n] = rem(tPtr, spo[n][n][n]);
            if (!this._inUse(s)){
                this._node.remove(s);
            }
            if (!this._inUse(p)){
                this._node.remove(p);
            }
            if (!this._inUse(o)){
                this._node.remove(o);
            }
        },
        _inUse: function(node){
            var spo = this.spo;
            var n = -1;
            var inList = function(s, p, o){
                return ((spo[s] && spo[s][p] && spo[s][p][o]) || []).length > 0;
            };
            return inList(node, n, n) || inList(n, node, n) || inList(n, n, node);
        },
        _remove: function (triple) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Graph-remove-Graph-Triple-triple */
            var spo = this.spo;

            var count = 0;
            var s = triple.s ? triple.s : this._node.lookup(triple.subject.toNT());
            if (s != null && spo[s]) {
                var p = triple.p ? triple.p : this._node.lookup(triple.predicate.toNT());
                if (p != null && spo[s][p]) {
                    var o = triple.o ? triple.o : this._node.lookup(triple.object.toNT());
                    if (o != null && o in spo[s][p]) {
                        var ptr = spo[s][p][o];
                        this._removeByPtr(ptr);
                    }
                    if (spo[s][p] == {}) {
                        delete spo[s][p];
                    }
                }
                if (spo[s] == {}) {
                    delete spo[s];
                }
            }
            return count;
        },
        toArray: function () {
            var out = [];
            this._triples.forEach(function (t) {
                out.push(this._expand(t));
            }.bind(this));

            return out;
        },
        _ptrToTriple: function (ptr) {
            if (lang.isArray(ptr)) {
                for (var idx = 0; idx < ptr.length; idx++) {
                    ptr[idx] = this._ptrToTriple(ptr[idx]);
                }
                return ptr;
            }

            return this._expand(this._triples.get(ptr));
        },
        _expand: function (tPtr) {
            var p = {};
            p.subject = this._node.get(tPtr.s);
            p.predicate = this._node.get(tPtr.p);
            p.object = this._node.get(tPtr.o);

            return new this.TripleCtr(p);
        },
        some: function (tFilter) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Graph-some-boolean-TripleFilter-callback */
            var lst = this._triples.keys();
            for (var idx = 0; idx < lst.length; idx++) {
                if (tFilter(this._ptrToTriple(lst[idx]), this) === true) {
                    return true;
                }
            }

            return false;
        },
        /**
         *
         * @param {Function} tFilter
         */
        every: function (tFilter) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Graph-every-boolean-TripleFilter-callback */
            // every is false if 
            return !this.some(function (t, g) {
                return (!tFilter(t, g));
            });
        },
        filter: function (tFilter) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Graph-filter-Graph-TripleFilter-filter */
            var results = this._newGraph();

            var lst = this._triples.keys();
            for (var idx = 0; idx < lst.length; idx++) {
                var t = this._ptrToTriple(lst[idx]);
                if (tFilter(t, this) === true) {
                    results.add(t);
                }
            }

            return results;
        },
        /**
         *
         * @param {Function} tCallback
         */
        forEach: function (tCallback) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Graph-forEach-void-TripleCallback-callback */
            var graph = this;
            var changed = [];
            this._triples.forEach(function (t) {
                var value = this._expand(t);
                var before = value.toString();
                tCallback(value, graph);

                if (before !== value.toString()) {
                    changed.push({
                        ptr: t,
                        newVal: value
                    });
                }
            }.bind(this));

            changed.forEach(function (changes) {
                this._removeByPtr(changes.ptr);
                this._add(changes.newVal);
            });

            this.onChange();
        },
        _newGraph: function () {
            return new rdfGraph({
                TripleCtr: this.TripleCtr
            });
        },
        /**
         * Returns all triples which match the given input
         * @param {RdfJs.Node} [subject]
         * @param {RdfJs.Node} [predicate]
         * @param {RdfJs.Node} [object]
         * @param {Number} [limit] - Max number of results that can be returned
         * @return {RdfJs.Triple[]}
         */
        match: function (subject, predicate, object, limit) {
            var ptrArray = this._match(subject, predicate, object);

            if (limit) {
                ptrArray = ptrArray.slice(0, limit);
            }

            var results = this._newGraph();
            ptrArray.forEach(function (ptr) {
                results.add(this._ptrToTriple(ptr));
            }.bind(this));

            return results;
        },
        _match: function (subject, predicate, object) {
            var s = subject && this._node.lookup(subject);
            var p = predicate && this._node.lookup(predicate);
            var o = object && this._node.lookup(object);
            if (subject == null) {
                s = -1;
            }
            if (predicate == null) {
                p = -1;
            }
            if (object == null) {
                o = -1;
            }

            var spo = this.spo;
            var out = spo[s] && spo[s][p] && spo[s][p][o];
            if (out == undefined) {
                out = [];
            } else if (!lang.isArray(out)) {
                out = [out];
            }
            return out;
        },
        merge: function (graph) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Graph-merge-Graph-Graph-graph */
            return lang.clone(this).addAll(graph);
        },
        addAll: function (graph) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Graph-addAll-Graph-Graph-graph */
            var self = this, triples;

            if (lang.isArray(graph)) {
                triples = graph;
            } else {
                triples = graph.toArray();
            }

            triples.forEach(function (t) {
                self.add(t);
            });

            return self;
        },
        onChange: function () {
            this.length = this._triples.length;

            return this;
        },
        addAction: function (tAction, run) {
            this.actions.push(tAction);

            if (run) {
                this.forEach(tAction);
            }
        },
        /*
        equals: function (graph) {
            if (graph.length === this.length) {
                var left = new rdfGraph(this);
                var right = new rdfGraph(graph);

                var pass2 = [];
                left.every({
                    record: pass2,
                    right: right,
                    run: function (t) {
                        var r = this.right;
                        if (!t.subject.isBlank() && !t.object.isBlank()) {
                            if (r.match(t.subject, t.predicate, t.object).length !== 1) {
                                return false;
                            }
                            this.remove(t);
                            r.remove(t);
                        } else if (!t.subject.isBlank()) {
                            this.record.push(t);
                        }

                        return true;
                    }
                });

                var removeMatch = function (exp, act) {
                };

                for (var idx = 0; idx < pass2.length; idx++) {
                    var t = pass2[idx];
                    var possible = right.match(t.subject, t.predicate, t.object);

                    if (!removeMatch(t, possible)) {
                        return false;
                    }
                }

            }
            return false;
        },*/
        /**
         * Makes a clone of the current graph
         * @description Faster than creating a new graph
         *              because it doesn't bother converting
         *              from pointers back to triples and then
         *              re-indexing
         * @return {RdfJs.Graph}
         */
        clone: function () {
            var clone = new rdfGraph();
            return lang.mixin(clone, this);
        },
        has: function (triple) {
            return this.match(triple.subject.toNT(), triple.predicate.toNT(), triple.object.toNT()).length > 0;
        }
    });

    return rdfGraph;
});