/**
 * Created by Akeron on 2/26/14.
 */
define([
    "./rdfLiteral",
    "./numeric",
    "./boolean"
], function (rdfLiteral, numeric, boolean) {
    /**
     * [109] GraphTerm ::= iri | RDFLiteral | NumericLiteral | BooleanLiteral | BlankNode |    NIL
     * @see http://www.w3.org/TR/sparql11-query/#rGraphTerm
     * @param {jazzHands.parser.Data} data - Information about the parsing process
     * @return {String | Null}
     */
    function literal(data) {
        return rdfLiteral(data) || numeric(data) || boolean(data);
    }

    return literal;
});