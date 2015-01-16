RdfJs is a simple library for interacting with Rdf data in JavaScript.  Most of the API comes from the (http://www.w3.org/TR/rdf-interfaces/ "Rdf Interfaces") specification.

The one modification I made was the addition of a TripleStore class which handles interaction with multiple Graphs.


##TripleStore##
A **TripleStore** represents a collection of (http://www.w3.org/TR/rdf-interfaces/#graphs "RDF Graphs").  And provides additional utilities for accessing the 'DEFAULT' graph as well as interacting with multiple Graphs at once using the 'ALL' keyword

<code>
class TripleStore {
    Graph    addGraph(String name);
    void     runOnGraphs(Function method, String|String[] graphs)
    void     setDefault(String|String[] value)
    void     add(Triple triple, String|String[] graphName)
    void     addAll(Graph graph, String|String[] graphName)
    void     remove(Triple triple, String|String{} graphName)
    void     removeMatches(String subject, String predicate, String object, String|String[] graphName)
    Triple[] toArray(String|String[] graphName)
    boolean  some(TripleFilter tFilter, String|String[])
    boolean  every(TripleFilter tFilter, String|String[])
    boolean  filter(TripleFilter tFilter, String|String[])
    boolean  forEach(TripleCallback tCallback, String|String[])
    Graph    match(String subject, String predicate, String object, String|String[] graphName)
    Graph    getGraph(String graphName)
}
<code>