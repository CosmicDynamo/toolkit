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
    "blocks/parser/Data",
    "blocks/parser/range",
    "blocks/parser/required",
    "blocks/parser/hasChar",
    "blocks/parser/matchChar",
    "blocks/parser/hasAnyChar",
    "RdfJs/parser/whiteSpace",
    "blocks/parser/keyWord",
    "blocks/parser/anyKeyWord",
    "RdfJs/parser/rdfType",
    "../RdfType",
    "./XsdLiteral",
    "./sparql/booleanLiteral",
    "RdfJs/parser/iriRef",
    "blocks/parser/uChar",
    "blocks/parser/utf16Encode",
    "blocks/parser/hex",
    "./sparql/baseDecl",
    "RdfJs/parser/langTag",
    "RdfJs/parser/numeric",
    "jazzHands/parser/sparql/anon",
    "blocks/parser/block",
    "polyfill/has!String.codePointAt"
], function (declare, kernel, lang, Deferred, when, rdfEnv, Data, range, required, hasChar, matchChar, hasAnyChar
    , whiteSpace, keyWord, anyKeyWord, rdfType, RdfType, XsdLiteral, booleanLiteral, iriRef, uChar, utf16Encode, hex
    , baseDecl, langTag, numeric, anon, block) {
    /* Implementation of <http://www.w3.org/TeamSubmission/turtle/> */
    /**
     * @class jazzHands.parser.turtle
     * @mixes jazzHands.parser._Parser
     */
    return declare([], {
        parse: function (text) {
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
                this._onError(error);
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
            error.input = text;
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
            } else {
                whiteSpace(input); //Clean up potential trailing space
                return r;
            }
        },
        directive: function (input) {
            //[3]	directive	::=	prefixID | base | sparqlPrefix | sparqlBase
            return this.prefixId(input) || this.base(input) || this.sPrefix(input) || baseDecl(input);
        },
        prefixId: function (input) {
            //[4]	prefixID	::=	'@prefix' PNAME_NS IRIREF '.'
            var key = keyWord(input, "@prefix", true, true);
            if (key) {
                whiteSpace(input);
                var pfx = required(this.pNameNs(input), key, "prefix name");
                whiteSpace(input);
                var iri = required(iriRef(input), key, "iri");
                required(hasChar(input, ".", false, true), key, ".");

                input.setPrefix(pfx.substr(0, pfx.length - 1), iri.toString());
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
        sPrefix: function (input) {
            //[6s]	sparqlPrefix	::=	"PREFIX" PNAME_NS IRIREF
            var key = keyWord(input, "prefix", false, true);
            if (key) {
                whiteSpace(input);
                var pfx = required(this.pNameNs(input), key, "prefix name");
                whiteSpace(input);
                var iri = required(iriRef(input), key, "iri");

                input.setPrefix(pfx.substr(0, pfx.length - 1), iri.toString());
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
                        object: required(this.objectList(scoped), "predicate", "object list")
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
            return this.iri(input) || this.bNode(input) || this.collection(input);
        },
        predicate: function (input) {
            //[11]	predicate	::=	iri
            return this.iri(input);
        },
        object: function (input) {
            //[12]	object	::=	iri | BlankNode | collection | blankNodePropertyList | literal
            var start = input.pos;
            whiteSpace(input);
            var out = this.iri(input) || this.bNode(input) || this.collection(input) || this.bNodePropList(input) || this.literal(input);
            if (!out) {
                input.pos = start;
            }
            return out;
        },
        literal: function (input) {
            //[13]	literal	::=	RDFLiteral | NumericLiteral | BooleanLiteral
            return this.rdfLiteral(input) || this.numeric(input) || booleanLiteral(input);
        },
        bNodePropList: function (input) {
            //[14]	blankNodePropertyList	::=	'[' predicateObjectList ']'
            var list = block(input, '[', ']', 1, 1, this.pObjectList.bind(this));
            if (list) {
                var subject = input.createBlankNode();
                this._genTriples(input, subject, list);
                return subject;
            }
            return null;
        },
        collection: function (input) {
            //[15]	collection	::=	'(' object* ')'
            var list = block(input, '(', ')', 0, -1, this.object.bind(this));
            if (list) {
                var bNode = input.createBlankNode;
                var Triple = input.createTriple;

                var rdfFirst = RdfType("first");
                var rdfRest = RdfType("rest");

                var subject = bNode();
                var rest = RdfType("nil");
                for (var idx = list.length - 1; idx > -1; idx--) {
                    input.graph.addAll([
                        Triple(subject, rdfFirst, list[idx]),
                        Triple(subject, rdfRest, rest)
                    ]);
                    rest = subject;
                    subject = bNode();
                }
                return rest;
            }
            return list;
        },
        numeric: function (input) {
            //[16]	NumericLiteral	::=	INTEGER | DECIMAL | DOUBLE
            //[19]	INTEGER	::=	[+-]? [0-9]+
            //[20]	DECIMAL	::=	[+-]? [0-9]* '.' [0-9]+
            //[21]	DOUBLE	::=	[+-]? ([0-9]+ '.' [0-9]* EXPONENT | '.' [0-9]+ EXPONENT | [0-9]+ EXPONENT)
            var start = input.pos;
            var whole = hasAnyChar(input, ['+', '-']) || "";
            var value = numeric(input);
            if (value) {
                value.nominalValue = whole + value.nominalValue;
                return value;
            }
            input.pos = start;
            return null;
        },
        rdfLiteral: function (input) {
            //[128s]	RDFLiteral	::=	String (LANGTAG | '^^' iri)?
            var value = this.string(input);
            if (value) {
                var dt = "", lang = langTag(input) || "";
                if (lang === "" && keyWord(input, "^^", false, false)) {
                    dt = this.iri(input);
                    dt = "^^" + ((dt.toNT && dt.toNT()) || dt)
                }
                return value + lang + dt;
            }
            return null;
        },
        string: function (input) {
            //[17]	String	::=	STRING_LITERAL_QUOTE | STRING_LITERAL_SINGLE_QUOTE | STRING_LITERAL_LONG_SINGLE_QUOTE | STRING_LITERAL_LONG_QUOTE
            return this.longString(input) || this.shortString(input);
        },
        iri: function (input) {
            //[135s]	iri	::=	IRIREF | PrefixedName
            return iriRef(input) || this.prefixName(input);
        },
        prefixName: function (input) {
            //[136s]	PrefixedName	::=	PNAME_LN | PNAME_NS
            var start = input.pos;
            whiteSpace(input);
            var value = this.pNameLn(input) || this.pNameNs(input);
            if (value == null) {
                input.pos = start;
            } else {
                var exp = input.resolve(value);
                if (exp === value){
                    throw { message: "Prefix not supplied: " + value.split(":")[0]};
                }
                value = "<" + exp + ">";
            }
            return value;
        },
        bNode: function (input) {
            //[137s]	BlankNode	::=	BLANK_NODE_LABEL | ANON
            return this.bNodeLabel(input) || anon(input);
        },
        pNameNs: function (input) {
            //[139s]	PNAME_NS	::=	PN_PREFIX? ':'
            var start = input.pos;
            var pfx = this.pnPrefix(input) || "";
            if (hasChar(input, ":")) {
                return pfx + ":";
            }
            input.pos = start;
            return null;
        },
        pNameLn: function (input) {
            //[140s]	PNAME_LN	::=	PNAME_NS PN_LOCAL
            var pfx = this.pNameNs(input);
            if (pfx) {
                return pfx + (this.pnLocal(input) || "");
            }
            return null;
        },
        bNodeLabel: function (input) {
            //[141s]	BLANK_NODE_LABEL	::=	'_:' (PN_CHARS_U | [0-9]) ((PN_CHARS | '.')* PN_CHARS)?
            var value = null;
            if (keyWord(input, "_:")) {
                value = this.pnCharsU(input) || matchChar(input, "[0-9]");
                value += range(input, 0, -1, function (scoped) {
                    return this.pnChars(scoped) || hasChar(scoped, ".");
                }.bind(this)).join("");
                value = "_:" + value + (this.pnChars(input) || "");
                if (value[value.length - 1] === "."){
                    throw { message: "Blank Node cannot end in '.'"};
                }
            }
            return value;
        },
        shortString: function (input) {
            //[22]	STRING_LITERAL_QUOTE	::=	'"' ([^#x22#x5C#xA#xD] | ECHAR | UCHAR)* '"' /* #x22=" #x5C=\ #xA=new line #xD=carriage return */
            //[23]	STRING_LITERAL_SINGLE_QUOTE	::=	"'" ([^#x27#x5C#xA#xD] | ECHAR | UCHAR)* "'" /* #x27=' #x5C=\ #xA=new line #xD=carriage return */
            var start = matchChar(input, "['\"]", true), value = start;
            if (start) {
                var except = "[^\x5C\x5C\x0A\x0D" + start + "]";
                value += range(input, 0, -1, function (scoped) {
                    return this.eChar(scoped) || uChar(scoped, except) || matchChar(input, except);
                }.bind(this)).join("");
                value += required(hasChar(input, start), "string literal", start);
            }
            return value;
        },
        longString: function (input) {
            //[24]	STRING_LITERAL_LONG_SINGLE_QUOTE	::=	"'''" (("'" | "''")? ([^'\] | ECHAR | UCHAR))* "'''"
            //[25]	STRING_LITERAL_LONG_QUOTE	::=	'"""' (('"' | '""')? ([^"\] | ECHAR | UCHAR))* '"""'
            var start = anyKeyWord(input, ["'''", '"""'], true, true);
            var value = start;
            if (start) {
                var except = "[^" + start[0] + "\\\\]";
                value += range(input, 0, -1, function (scoped) {
                    if (scoped.input.indexOf(start, scoped.pos) !== scoped.pos) {
                        return hasAnyChar(input, ['"', "'"]) || this.eChar(input) || uChar(input, except) || matchChar(input, "[^\\'\\\\]");
                    }
                    return null;
                }.bind(this)).join("");

                value += required(keyWord(input, start), "long string", start);
            }
            return value;
        },
        eChar: function (input) {
            //[159s]	ECHAR	::=	'\' [tbnrf"'\]
            var start = input.pos;
            if (hasChar(input, "\\")) {
                var ch = matchChar(input, "[tbnrf\"'\\\\]");
                switch (ch) {
                    case "t":
                        return "\t";
                    case "n":
                        return "\n";
                    case "r":
                        return "\r";
                    case "'":
                        return "'";
                    case '"':
                        return '"';
                    case "b":
                        return "\b";
                    case "\\":
                        return "\\";
                    case "f":
                        return "\f";
                    //case "u": //handled somewhere else, but still valid
                   //     input.pos = start;
                    //    break;
                   default:
                    //    throw {message: "invalid escape character: " + ch};
                        input.pos = start;
                }
            }
            return null;
        },
        pnCharsBase: function (input) {
            //[163s]	PN_CHARS_BASE	::=	[A-Z] | [a-z] | [#x00C0-#x00D6] | [#x00D8-#x00F6] | [#x00F8-#x02FF] | [#x0370-#x037D] | [#x037F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
            var ch = matchChar(input, "[A-Z]|[a-z]|[\xC0-\xD6]|[\xD8-\xF6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]");
            if (ch === null) {
                var code = input.input.codePointAt(input.pos);
                if (code >= 0x10000 && code <= 0xEFFFF) {
                    input.pos += 2;
                    return utf16Encode("0x" + code.toString(16));
                }
            }
            return ch;
        },
        pnCharsU: function (input) {
            //[164s]	PN_CHARS_U	::=	PN_CHARS_BASE | '_'
            return this.pnCharsBase(input) || hasChar(input, "_");
        },
        pnChars: function (input) {
            //[166s]	PN_CHARS	::=	PN_CHARS_U | '-' | [0-9] | #x00B7 | [#x0300-#x036F] | [#x203F-#x2040]
            return this.pnCharsU(input) || hasChar(input, "-") || matchChar(input, "[0-9]|[\xB7]|[\u0300-\u036F]|[\u203F-\u2040]");
        },
        pnPrefix: function (input) {
            //[167s]	PN_PREFIX	::=	PN_CHARS_BASE ((PN_CHARS | '.')* PN_CHARS)?
            var value = this.pnCharsBase(input);
            if (value) {
                value += range(input, 0, -1, function (scoped) {
                    return this.pnChars(scoped) || hasChar(scoped, ".");
                }.bind(this)).join("");
                value += this.pnChars(input) || "";
            }
            return value;
        },
        pnLocal: function (input) {
            //[168s]	PN_LOCAL	::=	(PN_CHARS_U | ':' | [0-9] | PLX) ((PN_CHARS | '.' | ':' | PLX)* (PN_CHARS | ':' | PLX))?
            var start = input.pos, idx, ch;
            var value = this.pnCharsU(input) || hasChar(input, ":") || matchChar(input, "[0-9]") || this.plx(input);
            if (value === ".") {
                value = null;
                input.pos = start;
            }
            if (value) {
                value += range(input, 0, -1, function (scoped) {
                    idx = scoped.pos;
                    ch = this.pnChars(scoped) || hasAnyChar(scoped, [".", ":"]) || this.plx(scoped);
                    if (ch !== null) {
                        start = idx;
                    }
                    return ch;
                }.bind(this)).join("");
                idx = input.pos;
                ch = this.pnChars(input) || hasChar(input, ":") || this.plx(input);
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