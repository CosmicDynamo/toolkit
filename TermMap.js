/**
 * Created by Akeron on 3/8/14.
 */
define([
    "dojo/_base/declare",
    "./_Map"
], function (declare, _Map) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-PrefixMap> */

    return declare([_Map], {
        constructor: function (args) {
            if (args.default) {
                this.set("", args.default);
            }
        },
        /*get : http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-get-omittable-getter-DOMString-DOMString-term */
        /*set : http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-set-omittable-setter-void-DOMString-term-DOMString-iri */
        /*remove : http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-remove-omittable-deleter-void-DOMString-term */
        isValid: function (term) {
            var valid = this.inherited(arguments);
            if (!valid) {
                throw {message: "Term must not contain any whitespaces"};
            }

            if (term.indexOf(":") !== -1) {
                throw {message: "Terms must not contain ':'"};
            }
            return valid;
        },
        resolve: function (term) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-resolve-DOMString-DOMString-term */
            var v = this.get(term);
            if (!v) {
                if (this.default) {
                    v = this.default + term;
                } else {
                    return term;
                }
            }

            return v;
        },
        shrink: function (iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-shrink-DOMString-DOMString-iri */
            var map = this;
            return this.keys().find(function (term) {
                    return map.get(term) === iri;
                }) || iri;
        },
        setDefault: function (iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-setDefault-void-DOMString-iri */
            this.set("", iri);
        }
        /*addAll : http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-addAll-TermmMap-TermMap-terms-boolean-override */
    });
});