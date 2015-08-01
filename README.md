<<<<<<< Temporary merge branch 1
<<<<<<< Temporary merge branch 1
<<<<<<< Temporary merge branch 1
<<<<<<< Temporary merge branch 1
<<<<<<< Temporary merge branch 1
JavaScript NodeJs Service
=========================

The collection of JavaScript application functionality that will be required to run a NodeJs Semantic Server  

##Application
Added functionality required to run a Semantic Application in a NodeJs Server
=======
JavaScript Core
===============

The collection of 'core' JavaScript application functionality.  

This includes modules that will work in the browser as well as NodeJs or any other place where we might want a Semantic Application

##Application
The base sent of components and functionality that every growing application will need, which, for now, is none.  I will be adding stuff as needed

>>>>>>> Temporary merge branch 2
=======
blocks
======

A library of helpful data structures

##Cache
Adds the ability to store the retur from a function based on the single Hash (Sting | Object) key input to that function
~NOTE: This file was overriden during one of my git repo refactors.  actual functionality will need to be restored

##HashTable
Add functionality for looking up an Object by HashKey as well as looping through the items in the table
* Created to help avoid the possible indexing over.. type messages and the bulky safe code for doing just that

##Exception
A class for creating simple Exception objects with a message
* It is desired that at some point this wll help with errors over async code, but we shall see


>>>>>>> Temporary merge branch 2
=======
JavaScript Client
=================

The collection of JavaScript application functionality that will be required to run a Semantic Client.  

##Application
Added functionality required to run a Semantic Application in a Web Client

>>>>>>> Temporary merge branch 2
=======
A collection of polyfills (And a few primitive prototype helper functions that I hacked in)

has: Used to make sure that the JavaScript code for a polyfill is only requested from the server if the specified object does not have it on it's prototype
'''
usage example:
require(["polyfill/has!String.endsWith"]);
'''

#Array#
filter: Filter the array to things which pass the filter function

find: returns the first object which passes the input test function

#Function#

next:  cheater method for Futures that calls setTimeout for your Function with the requested wait time

defer: cheater method like next, but will return a deferred that will resolve when your function's return Promise is resolved

#String#

codePointAt: ES6 method for handling two character ASCII codes

endsWith: Returns true if the string ends with the input string

includes: Returns true if the string includes the input string

startsWith: Returns true if the string starts with the input string
>>>>>>> Temporary merge branch 2
=======
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
>>>>>>> Temporary merge branch 2
