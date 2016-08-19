// example.js
(function (define) {

	// note: we're injecting all three CommonJS scoped variables
	define(function (require, exports, module) {

		"use strict"
		var canto34 = require('../src/canto34');

	    var lexer = new canto34.Lexer();

	    // add a token for whitespace
	    lexer.addTokenType({ 
	        name: "ws",       // give it a name
	        regexp: /[ \t]+/, // match spaces and tabs
	        ignore: true      // don't return this token in the result
	    });
	    
	    // add a token type for names, defines as strings of lower-case characters
	    lexer.addTokenType({ 
			name: "name", 
			regexp: /^[a-z]+/,
			role: ['entity', 'name']
  		});
	    
	    // bring in some predefined types for commas, period, and integers.
	    var types = canto34.StandardTokenTypes;
	    lexer.addTokenType(types.comma());
	    lexer.addTokenType(types.period());
	    lexer.addTokenType(types.integer());
	    
	    var parser = new canto34.Parser();
	    parser.listOfNameValuePairs = function() {
	        this.result = [];
	        this.nameValuePair();
	        while (!this.eof() && this.la1("comma")) {
	            this.match("comma");
	            this.nameValuePair();
	        }
	        this.match("period");
	    };
	    
	    parser.nameValuePair = function() {
	        var name = this.match("name").content;
	        var value = this.match("integer").content;
	        this.result.push({ name:name, value: value });
	    };
	  
	    exports.lexer = lexer;
	    exports.parser = parser;
	});
}(
    typeof define == 'function' && define.amd
        ? define
        : function (factory) { factory(require, exports, module); }
));
