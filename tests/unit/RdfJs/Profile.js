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
    "intern!object",
    "intern/chai!assert",
    "RdfJs/Profile"
], function (intern, assert, Profile) {
    return new intern({
        name: "RdfJs/Profile",
        "constructor: if an input param is given, it will import the values": function(){
            var profile = new Profile({
                prefixes: {
                    "test": "http://example.com/",
                    "": "http://example.com/default-prefix#"
                },
                terms: {
                    "test": "http://example.com/"
                },
                vocab: "http://example.com/default-term#"
            });

            assert.strictEqual(profile.prefixes.get("test"), "http://example.com/");
            assert.strictEqual(profile.prefixes.get(""), "http://example.com/default-prefix#");

            assert.strictEqual(profile.terms.get("test"), "http://example.com/");
            assert.strictEqual(profile.terms.getDefault(), "http://example.com/default-term#");
        },
        "resolve: If input contains a ':' then this method returns the result of calling prefixes.resolve": function(){
            var profile = new Profile({
                prefixes: {
                    "test": "http://example.com/",
                    "": "http://example.com/default-prefix#"
                },
                terms: {
                    "test": "http://example.com/"
                },
                vocab: "http://example.com/default-term#"
            });

            assert.strictEqual(profile.resolve("test:value"), "http://example.com/value");
        },
        "resolve: If input does not contain a ':'  this method returns the result of calling terms.resolve": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-Profile-resolve-DOMString-DOMString-toresolve"
            var profile = new Profile({
                prefixes: {
                    "test": "http://example.com/",
                    "": "http://example.com/default-prefix#"
                },
                terms: {
                    "test": "http://example.com/"
                },
                vocab: "http://example.com/default-term#"
            });

            assert.strictEqual(profile.resolve("test2"), "http://example.com/default-term#test2");
        },
        "setVocab: sets the default term": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setDefaultVocabulary-void-DOMString-iri"
            var profile = new Profile({
                prefixes: {
                    "test": "http://example.com/",
                    "": "http://example.com/default-prefix#"
                },
                terms: {
                    "test": "http://example.com/"
                },
                vocab: "http://example.com/default-term#"
            });

            assert.strictEqual(profile.resolve("test2"), "http://example.com/default-term#test2");
            profile.setVocab("http://example.org/default#");
            assert.strictEqual(profile.resolve("test2"), "http://example.org/default#test2");
        },
        "setTerm: associates an IRI with a term": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setTerm-void-DOMString-term-DOMString-iri"
            var profile = new Profile({
                prefixes: {
                    "test": "http://example.com/",
                    "": "http://example.com/default-prefix#"
                },
                terms: {
                    "test": "http://example.com/"
                },
                vocab: "http://example.com/default-term#"
            });

            assert.strictEqual(profile.resolve("test2"), "http://example.com/default-term#test2");
            profile.setTerm("test2", "http://example.com/test2");
            assert.strictEqual(profile.resolve("test2"), "http://example.com/test2");
        },
        "setPrefix: associates an IRI with a prefix": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-Profile-setPrefix-void-DOMString-prefix-DOMString-iri"
            var profile = new Profile({
                prefixes: {
                    "test": "http://example.com/",
                    "": "http://example.com/default-prefix#"
                },
                terms: {
                    "test": "http://example.com/"
                },
                vocab: "http://example.com/default-term#"
            });

            assert.strictEqual(profile.resolve("test2:"), "test2:");
            profile.setPrefix("test2", "http://example.com/test2");
            assert.strictEqual(profile.resolve("test2:"), "http://example.com/test2");
        },
        "merge: adds the terms and prefixes from the input profile into this one: override = false": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-Profile-importProfile-Profile-Profile-profile-boolean-override"
            var profile = new Profile({
                prefixes: {
                    "test": "http://example.com/",
                    "": "http://example.com/default-prefix#"
                },
                terms: {
                    "test": "http://example.com/"
                },
                vocab: "http://example.com/default-term#"
            });

            var more = new Profile({
                prefixes: {
                    "test": "http://example.com/override",
                    "test2": "http://example.com/test2",
                    "": "http://example.com/default#new"
                },
                terms: {
                    "test": "http://example.com/override",
                    "test2": "http://example.com/test2"
                },
                vocab: "http://example.com/default#new"
            });

            profile.merge(more, false);
            assert.strictEqual(profile.resolve("test:"), "http://example.com/");
            assert.strictEqual(profile.resolve("test2:"), "http://example.com/test2");
            assert.strictEqual(profile.resolve(":"), "http://example.com/default-prefix#");

            assert.strictEqual(profile.resolve("test"), "http://example.com/");
            assert.strictEqual(profile.resolve("test2"), "http://example.com/test2");
            assert.strictEqual(profile.resolve("unknown"), "http://example.com/default-term#unknown");
        },
        "merge: adds the terms and prefixes from the input profile into this one: override = true": function(){
            //"http://www.w3.org/TR/rdf-interfaces/#widl-Profile-importProfile-Profile-Profile-profile-boolean-override"
            var profile = new Profile({
                prefixes: {
                    "test": "http://example.com/",
                    "": "http://example.com/default-prefix#"
                },
                terms: {
                    "test": "http://example.com/"
                },
                vocab: "http://example.com/default-term#"
            });

            var more = new Profile({
                prefixes: {
                    "test": "http://example.com/override",
                    "test2": "http://example.com/test2",
                    "": "http://example.com/default-prefix#new"
                },
                terms: {
                    "test": "http://example.com/override",
                    "test2": "http://example.com/test2"
                },
                vocab: "http://example.com/default-term#new"
            });

            profile.merge(more, true);
            assert.strictEqual(profile.resolve("test:"), "http://example.com/override");
            assert.strictEqual(profile.resolve("test2:"), "http://example.com/test2");
            assert.strictEqual(profile.resolve(":"), "http://example.com/default-prefix#new");

            assert.strictEqual(profile.resolve("test"), "http://example.com/override");
            assert.strictEqual(profile.resolve("test2"), "http://example.com/test2");
            assert.strictEqual(profile.resolve("unknown"), "http://example.com/default-term#newunknown");
        }
    });
});