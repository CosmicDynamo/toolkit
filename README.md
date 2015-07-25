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