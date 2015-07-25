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
 * @module RdfJs.TermMap
 */
define([
    "dojo/_base/declare",
    "./_Map"
], function (declare, _Map) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-PrefixMap> */

    return declare([_Map], {
        constructor: function (args, defaultPrefix) {
            this._default = defaultPrefix;
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
                return (this.getDefault() || "") + term
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
            this._default = iri;
        },
        getDefault: function () {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-getDefault-DOMString-iri */
            return this._default;
        },
        addAll : function(values, override) {
            /*http://www.w3.org/TR/rdf-interfaces/#widl-TermMap-addAll-TermmMap-TermMap-terms-boolean-override */
            if (override || !this.getDefault()){
                this.setDefault(values.getDefault());
            }
            return this.inherited(arguments);
        }
    });
});