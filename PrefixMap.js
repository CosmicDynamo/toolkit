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
 * @module RdfJs.PrefixMap
 */
define([
    "dojo/_base/declare", "./_Map"
], function (declare, _Map) {
    /**
     * @class RdfJs.PrefixMap
     * @see http://www.w3.org/TR/rdf-interfaces/#idl-def-PrefixMap
     */
    return declare([_Map], {
        values: null,
        constructor: function () {
            if (this.default) {
                this.values[""] = this.default;
            }
        },
        /*get :  http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-get-omittable-getter-DOMString-DOMString-prefix */
        /*set : http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-set-omittable-setter-void-DOMString-prefix-DOMString-iri */
        /*remove : http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-remove-omittable-deleter-void-DOMString-prefix */
        isValid: function (prefix) {
            var valid = this.inherited(arguments);
            if (!valid) {
                throw "Prefix must not contain any whitespaces";
            }
            return valid;
        },
        resolve: function (curie) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-resolve-DOMString-DOMString-curie */
            if (curie.indexOf(":") === -1 || curie.indexOf("://") > -1) {
                return curie;
            }

            var parts = curie.split(":");
            var ns = parts[0], suffix = parts.slice(1).join(":");

            var p = this.get(ns);

            //w3 spec specifies if prefix unrecognized return null.  It was decided to just have it return the original curie
            return (p ? p + suffix : curie);
        },
        shrink: function (iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-shrink-DOMString-DOMString-iri */
            var p = null, u = "";
            for (var pref in this.values) {
                var val = this.values[pref];
                if (iri.indexOf(val) === 0) {
                    if (val.length > u.length) {
                        p = pref;
                        u = val;
                    }
                }
            }

            if (p !== null) {
                return p + ":" + iri.substring(u.length);
            }

            return iri;
        },
        setDefault: function (iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-setDefault-void-DOMString-iri */
            this.values[""] = iri;
        }
        /*addAll : http://www.w3.org/TR/rdf-interfaces/#widl-PrefixMap-addAll-PrefixMap-PrefixMap-prefixes-boolean-override */
    });
})