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
 * @module jazzHands.parser.turtle
 */
define([
    "dojo/_base/declare",
    "dojo/_base/kernel",
    "dojo/_base/lang",
    "dojo/_base/Deferred",
    "dojo/when",
    "RdfJs/Environment",
    "RdfJs/parser/Data",
    "blocks/parser/range",
    "blocks/parser/required",
    "blocks/parser/hasChar",
    "blocks/parser/matchChar",
    "blocks/parser/hasAnyChar",
    "RdfJs/parser/whiteSpace",
    "blocks/parser/keyWord",
    "RdfJs/parser/rdfType",
    "../RdfType",
    "./sparql/booleanLiteral",
    "RdfJs/parser/iriRef",
    "blocks/parser/hex",
    "./sparql/baseDecl",
    "RdfJs/parser/langTag",
    "RdfJs/parser/numeric",
    "blocks/parser/block",
    "RdfJs/parser/string",
    "RdfJs/node/Literal",
    "RdfJs/node/Named",
    "RdfJs/parser/pnCharsBase",
    "RdfJs/parser/pnCharsU",
    "RdfJs/parser/pnChars",
    "RdfJs/parser/bNode",
    "./sparql/pnPrefix",
    "./sparql/pNameNs",
    "./sparql/prefixDecl",
    "blocks/parser/find",
    "polyfill/has!String.codePointAt"
], function (declare, kernel, lang, Deferred, when, rdfEnv, Data, range, required, hasChar, matchChar, hasAnyChar
    , whiteSpace, keyWord, rdfType, RdfType, booleanLiteral, iriRef, hex, baseDecl, langTag, numeric, block
    , string, LiteralNode, NamedNode, pnCharsBase, pnCharsU, pnChars, bNode, pnPrefix, pNameNs, sparqlPrefix
    , find) {
    /* Implementation of <http://www.w3.org/TeamSubmission/turtle/> */
    /**
     * @class jazzHands.parser.turtle
     * @mixes jazzHands.parser._Parser
     */
    return declare([], {
        parse: function (text) {
            this.input = text;
            var error = null;
            var loc = kernel.global.location;
            var base = loc ? (loc.origin + loc.pathname) : "";
            var input = new rdfEnv(new Data({
                input: text,
                done: new Deferred(),
                base: this._base || base.substr(0, base.lastIndexOf("/") + 1),
                callback: function (input, err) {
                    if (err) {
                        this.done.reject(err);
                    } else {
                        this.done.resolve(input);
                    }
                }
            }));
            input.whiteSpace = whiteSpace;
            input.graph = input.createGraph();
            try {
                var done = this.turtleDoc(input);
            } catch (err) {
                this._onError(err);
            }

            return when(done, function () {
                if (!error) {
                    if (input.pos < input.input.length) {
                        error = {message: "Statement found after end of valid turtle"};
                    } else {
                        return input.graph;
                    }
                }
            }, this._onError);
        },
        _onError: function (error) {
            var wP = "";
            error = lang.mixin({
                failed: true,
                whileParsing: wP ? wP : "turtle document"
            }, error);
            error.msg = error.message;
            error.message = 'Parsing Error ' + error.msg + " while parsing " + error.whileParsing;
            error.input = this.input;
            throw error;
        },
        setBase: function (iri) {
            this._base = iri;
        },
        turtleDoc: function (input) {
            //[1]	turtleDoc	::=	statement*
            return range(input, 0, -1, this.statement.bind(this));
        },
        statement: function (input) {
            //[2]	statement	::=	directive | triples '.'
            var r = this.directive(input);
            if (!r) {
                return when(this.triples(input), function (triples) {
                    if (triples !== null) {
                        required(hasChar(input, '.', false, true), "statement", ".");
                    }
                    whiteSpace(input);
                    return triples;
                });
            }
            return when(r, function (done) {
                whiteSpace(input);
                return done;
            });
        },
        directive: function (input) {
            //[3]	directive	::=	prefixID | base | sparqlPrefix | sparqlBase
            return find(input, [this.prefixId.bind(this), this.base.bind(this), sparqlPrefix, baseDecl]);
        },
        prefixId: function (input) {
            //[4]	prefixID	::=	'@prefix' PNAME_NS IRIREF '.'
            var key = keyWord(input, "@prefix", true, true);
            if (key) {
                whiteSpace(input);
                var pfx = required(pNameNs(input), key, "prefix name");
                whiteSpace(input);
                var iri = required(iriRef(input), key, "iri");
                required(hasChar(input, ".", false, true), key, ".");

                input.prefixMap.set(pfx, iri.toString());
            }
            return key;
        },
        base: function (input) {
            //[5]	base	::=	'@base' IRIREF '.'
            var key = keyWord(input, "@base", true, true);
            if (key) {
                whiteSpace(input);
                var iri = required(iriRef(input), key, "iri");
                input.base = iri.toString();
                required(hasChar(input, ".", false, true), key, ".");
            }
            return key;
        },
        triples: function (input) {
            //[6]	triples	::=	subject predicateObjectList | blankNodePropertyList predicateObjectList?
            return when(this.subject(input), function (terms) {
                var props, isRequired = true;
                if (terms == null) {
                    terms = this.bNodePropList(input);
                    isRequired = false;
                }
                if (terms) {
                    props = this.pObjectList(input);

                    if (isRequired) {
                        required(props, "subject", "predicate");
                    }
                    return props ? this._genTriples(input, terms, props) : terms;
                }
                return null;
            }.bind(this));
        },
        pObjectList: function (input) {
            //[7]	predicateObjectList	::=	verb objectList (';' (verb objectList)?)*
            return range(input, 1, -1, function (scoped) {
                var start = input.pos;
                var p = this.verb(scoped);
                if (p) {
                    return{
                        predicate: p,
                        object: required(this.objectList(scoped), "predicate missing object list")
                    }
                }
                input.pos = start;
                return null;
            }.bind(this), ";", false);
        },
        objectList: function (input) {
            //[8]	objectList	::=	object (',' object)*
            return range(input, 1, -1, function () {
                return this.object(input);
            }.bind(this), ",", false);
        },
        verb: function (input) {
            //[9]	verb	::=	predicate | 'a'
            return this.predicate(input) || rdfType(input);
        },
        subject: function (input) {
            //[10]	subject	::=	iri | BlankNode | collection
            return this.iri(input) || bNode(input) || this.collection(input);
        },
        predicate: function (input) {
            //[11]	predicate	::=	iri
            return this.iri(input);
        },
        object: function (input) {
            //[12]	object	::=	iri | BlankNode | collection | blankNodePropertyList | literal
            var start = input.pos;
            whiteSpace(input);
            var out = this.iri(input) || bNode(input) || this.collection(input) || this.bNodePropList(input) || this.literal(input);
            if (!out) {
                input.pos = start;
            }
            return out;
        },
        literal: function (input) {
            //[13]	literal	::=	RDFLiteral | NumericLiteral | BooleanLiteral
            return this.rdfLiteral(input) || numeric(input) || booleanLiteral(input);
        },
        bNodePropList: function (input) {
            //[14]	blankNodePropertyList	::=	'[' predicateObjectList ']'
            var list = block(input, '[', ']', 1, 1, this.pObjectList.bind(this));
            if (list) {
                var subject = input.createBlankNode();
                this._genTriples(input, subject, list[0]);
                return subject;
            }
            return null;
        },
        collection: function (input) {
            //[15]	collection	::=	'(' object* ')'
            var list = block(input, '(', ')', 0, -1, this.object.bind(this));
            if (list) {
                var BlankNode = input.createBlankNode;
                var Triple = input.createTriple;

                var rdfFirst = RdfType("first");
                var rdfRest = RdfType("rest");

                var subject = BlankNode();
                var rest = RdfType("nil");
                for (var idx = list.length - 1; idx > -1; idx--) {
                    input.graph.addAll([
                        Triple(subject, rdfFirst, list[idx]),
                        Triple(subject, rdfRest, rest)
                    ]);
                    rest = subject;
                    subject = BlankNode();
                }
                return rest;
            }
            return list;
        },
        rdfLiteral: function (input) {
            //[128s]	RDFLiteral	::=	String (LANGTAG | '^^' iri)?
            var value = string(input);
            if (value != null) {
                var dt, lang = langTag(input);
                if (!lang && keyWord(input, "^^", false, false)) {
                    dt = this.iri(input);
                    dt = dt && dt.toString();
                }
                return new LiteralNode(value, lang, dt);
            }
            return null;
        },
        iri: function (input) {
            //[135s]	iri	::=	IRIREF | PrefixedName
            return iriRef(input) || this.prefixName(input);
        },
        prefixName: function (input) {
            //[136s]	PrefixedName	::=	PNAME_LN | PNAME_NS
            var start = input.pos;
            whiteSpace(input);
            var value = this.pNameLn(input); //There is no case for pNameNs that would not already be returned by pNameLn
            if (value == null) {
                input.pos = start;
                return null;
            }
            var exp = input.prefixMap.resolve(value);
            if (exp === value){
                throw { message: "Prefix not supplied: " + value.split(":")[0]};
            }
            return NamedNode(exp);
        },
        pNameLn: function (input) {
            //[140s]	PNAME_LN	::=	PNAME_NS PN_LOCAL
            var pfx = pNameNs(input);
            if (pfx !== null) {
                return pfx + ':' + (this.pnLocal(input) || "");
            }
            return null;
        },
        pnLocal: function (input) {
            //[168s]	PN_LOCAL	::=	(PN_CHARS_U | ':' | [0-9] | PLX) ((PN_CHARS | '.' | ':' | PLX)* (PN_CHARS | ':' | PLX))?
            var start = input.pos, idx, ch;
            var value = pnCharsU(input) || hasChar(input, ":") || matchChar(input, "[0-9]") || this.plx(input);
            if (value === ".") {
                value = null;
                input.pos = start;
            }
            if (value) {
                value += range(input, 0, -1, function (scoped) {
                    idx = scoped.pos;
                    ch = pnChars(scoped) || hasAnyChar(scoped, [".", ":"]) || this.plx(scoped);
                    if (ch !== null) {
                        start = idx;
                    }
                    return ch;
                }.bind(this)).join("");
                idx = input.pos;
                ch = pnChars(input) || hasChar(input, ":") || this.plx(input);
                if (ch !== null) {
                    start = idx;
                }

                if (value[value.length - 1] === ".") {
                    input.pos = start;
                    value = value.substr(0, value.length - 1);
                }
            }
            return value;
        },
        plx: function (input) {
            //[169s]	PLX	::=	PERCENT | PN_LOCAL_ESC
            return this.percent(input) || this.pnLocalEsc(input);
        },
        percent: function (input) {
            //[170s]	PERCENT	::=	'%' HEX HEX
            if (hasChar(input, "%")) {
                return "%" + required(range(input, 2, 2, hex), "%", "2 Hex digets").join("");
            }
            return null;
        },
        pnLocalEsc: function (input) {
            //[172s]	PN_LOCAL_ESC	::=	'\' ('_' | '~' | '.' | '-' | '!' | '$' | '&' | "'" | '(' | ')' | '*' | '+' | ',' | ';' | '=' | '/' | '?' | '#' | '@' | '%')
            var start = input.pos;
            var first = matchChar(input, "\\\\");
            if (first) {
                var second = matchChar(input, "[_|~|\\.|\\-|!|$|&|'|\\(|\\)|\\*|\\+|,|;|=|/|\\?|#|@|%]");
                if (second) {
                    return second;
                }
            }
            input.pos = start;
            return null;
        },
        _genTriples: function (input, subject, pObjectList) {
            var has = false;

            var isLiteral = subject.isLiteral && subject.isLiteral();
            if (lang.isString(subject)){
                isLiteral =subject.indexOf("_:") !== 0 && !(new RegExp("^<.*>$").test(subject));
            }
            if (isLiteral) {
                throw "Subject must be an iri or blank";
            }

            for (var pIdx = 0; pIdx < pObjectList.length; pIdx++) {
                var p = pObjectList[pIdx].predicate;
                if (!(p.isNamed && p.isNamed()) && !(new RegExp("^<.*>$").test(p))) {
                    throw "Predicates must be an iri";
                }

                for (var oIdx = 0; oIdx < pObjectList[pIdx].object.length; oIdx++) {
                    var o = pObjectList[pIdx].object[oIdx];
                    input.graph.add(new input.createTriple(subject, p, o));
                    has = true;
                }
            }
            return has;
        }
    });
});