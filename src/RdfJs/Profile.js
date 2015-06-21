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
 * @module RdfJs.Profile
 */
define([
    "dojo/_base/declare",
    "./PrefixMap",
    "./TermMap"
], function (declare, PrefixMap, TermMap) {
    /* Implementation of <http://www.w3.org/TR/rdf-interfaces/#idl-def-Profile> */
    return declare([], {
        prefixes: null,
        terms: null,
        constructor: function (params) {
            this.prefixes = new PrefixMap(params.prefixes);
            this.terms = new TermMap(params.terms, params.vocab);
        },
        resolve: function (c) {
            /* http://www.w3.org/TR/rdf-interfaces/#idl-def-Profile */
            if (!c) {
                return c;
            }

            return (c.indexOf(":") > -1 ? this.prefixes.resolve(c) : this.terms.resolve(c));
        },
        setVocab: function (iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setDefaultVocabulary-void-DOMString-iri */
            this.terms.setDefault(iri);
        },
        setTerm: function (term, iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setTerm-void-DOMString-term-DOMString-iri */
            this.terms.set(term, iri);
        },
        setPrefix: function (pref, iri) {
            /* http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setPrefix-void-DOMString-prefix-DOMString-iri */
            this.prefixes.set(pref, iri);
        },
         merge: function (prof, override) {
          /* http://www.w3.org/TR/rdf-interfaces/#widl-Profile-importProfile-Profile-Profile-profile-boolean-override */
            this.prefixes.addAll(prof.prefixes, override);
            this.terms.addAll(prof.terms, override);

            return this;
         },
        shrink: function (iri) {
            var out = this.terms.shrink(iri);
            if (iri === out) {
                out = this.prefixes.shrink(iri);
            }
            return out;
        }
    });
});