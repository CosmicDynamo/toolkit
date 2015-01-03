/**
 * Created by Akeron on 3/8/14.
 */
define([
    "dojo/_base/declare", "dojo/_base/lang", "./Profile", "./PrefixMap", "./TermMap", "./node/Blank",
    "./node/Literal", "./node/Named", "./Triple", "./Graph"
], function (declare, lang, Profile, PrefixMap, TermMap, bNode, lNode, nNode, Triple, Graph) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#rdf-environment> */
    return declare([Profile], {
        constructor: function (params) {
            lang.mixin(this, params);
        },
        createBlankNode: function (p) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createBlankNode-BlankNode */
            return new bNode(p);
        },
        createNamedNode: function (value) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createNamedNode-NamedNode-DOMString-value */
            return new nNode(value);
        },
        createLiteral: function (value, language, datatype) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createLiteral-Literal-DOMString-value-DOMString-language-NamedNode-datatype */
            if (lang.isObject(value)) {
                language = value.language;
                datatype = value.datatype;
            }
            return new lNode(value, language, datatype);
        },
        createTriple: function (s, p, o) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createTriple-Triple-RDFNode-subject-RDFNode-predicate-RDFNode-object */
            if (arguments.length == 3) {
                return new Triple({
                    subject: s,
                    predicate: p,
                    object: o
                });
            }
            return new Triple(s);
        },
        createGraph: function (triples) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createGraph-Graph---Triple-triples */
            var g = new Graph();
            if (lang.isArray(triples)) {
                g.addAll({_triples: triples});
            }
            return g;
        },
        createAction: function (test, action) {
            return function (triple) {
                if (test(triple)) {
                    action(triple);
                }
            };
        },
        createProfile: function (empty) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createProfile-Profile-boolean-empty */
            var prof = new Profile();
            if (!empty) {
                prof.import(this);
            }
            return prof;
        },
        createTermMap: function (empty) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createTermMap-TermMap-boolean-empty */
            var map = new TermMap();
            if (!empty) {
                map.addAll(this.terms);
            }
            return map;
        },
        createPrefixMap: function (empty) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-RDFEnvironment-createPrefixMap-PrefixMap-boolean-empty */
            var map = new PrefixMap();
            if (!empty) {
                map.addAll(this.prefixes);
            }
            return map;
        }
    });
});