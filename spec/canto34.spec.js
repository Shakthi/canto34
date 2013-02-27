"use strict"
var canto34 = require('../src/canto34');

describe('When adding token types to the lexer,', function() {

	var lexer;
	var tokenType;

	beforeEach(function() {
		lexer = new canto34.Lexer();
		tokenType = {
			name: "name",
			regexp: / \t/
		};
	});

	it('requires token types to have names', function() {
		expect(function() {
			delete tokenType.name;
			lexer.addTokenType(tokenType); 
		}).toThrow("Token types must have a 'name' property");
	});
		
	it('requires token types to have regexps', function() {
		expect(function() {
			delete tokenType.regexp
			lexer.addTokenType(tokenType); 
		}).toThrow("Token types must have a 'regexp' property");
	});

    it('requires the regexp property to be a regexp', function() {
		expect(function() {
			tokenType.regexp = "not a regexp";
			lexer.addTokenType(tokenType); 
		}).toThrow("Token types 'regexp' property must be an instance of RegExp");
	});

	it('allows an interpreter property to be a function', function() {
		
		expect(function() {
			tokenType.interpreter = function() { return 0; };
			lexer.addTokenType(tokenType);
		}).not.toThrow();
	});

	it('requires the interpreter property to be a function', function() {

		expect(function() {
			tokenType.interpreter = "not a function";
			lexer.addTokenType(tokenType);
		}).toThrow("Token types 'interpreter' property must be a function");
	});

});

describe('When lexing tokens', function() {
	
	var lexer;

	beforeEach(function() {
		lexer = new canto34.Lexer();
	});

	it('requires content to be passed', function() {
		expect(function() {
			lexer.tokenize(undefined);
		}).toThrow("No content provided");
	})

	it('requires at least one token type', function() {
		expect(function() {
			// we've not added any token types
			lexer.tokenize("something to tokenise");
		}).toThrow("No token types defined");
	})

    it('can tokenize a simple example', function() {
		lexer.addTokenType({
			name: "A",
			regexp: /a+/
		});

		lexer.addTokenType({
			name: "B",
			regexp: /b+/
		});

		var tokens = lexer.tokenize("aaabbbaaa");
		expect(tokens).toEqual([
			{ content: "aaa", type: "A", position:0 },
			{ content: "bbb", type: "B", position:3 },
			{ content: "aaa", type: "A", position:6 },
		]);
    })

	it('allows the use of an ignore flag in token types', function() {

		lexer.addTokenType({
			name: "whitespace",
			regexp: /[ \t]+/,
			ignore: true
		});


		lexer.addTokenType({
			name: "word",
			regexp: /[a-z]+/,
			ignore: false
		});

		var tokens = lexer.tokenize("aa bb cc");
		expect(tokens).toEqual([ 
			{ content:"aa", type:"word", position:0 },
			{ content:"bb", type:"word", position:3 },
			{ content:"cc", type:"word", position:6 }
		]);
	});

	it('allows the use of custom interpreters', function() {
		lexer.addTokenType({
			name: "integer",
			regexp: /\d+/,
			interpreter: function(content) {
				return parseInt(content);
			}
		});

		var tokens = lexer.tokenize("123");
		expect(tokens).toEqual([
			{ content: 123, type:"integer", position:0 }
		]);
	});
});