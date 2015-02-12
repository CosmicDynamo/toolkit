/**
 * Created by Akeron on 2/26/14.
 */
define([
    "./iri",
    "./literal",
    "./bNode",
    "./nil"
], function (iri, literal, bNode, nil) {
    /**
     * [109] GraphTerm ::= iri | RDFLiteral | NumericLiteral | BooleanLiteral | BlankNode |    NIL
     * @see http://www.w3.org/TR/sparql11-query/#rGraphTerm
     * @param {jazzHands.parser.Data} data - Information about the parsing process
     * @return {RdfJs.Node | Null}
     */
    function graphTerm(data) {
        return iri(data) || literal(data) || bNode(data) || nil(data);
    }

    return graphTerm;
});