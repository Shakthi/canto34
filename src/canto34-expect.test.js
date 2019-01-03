import * as canto34 from './canto34';
import {expectMatchers} from "./canto34-expect";

expect.extend({
	toFailTest(actual, msg) {
		let failed = false;
		let actualMessage = "";
		try
		{
			actual();
		} 
		catch(ex)
		{
			actualMessage = ex.message;
			failed = true;
		}

		if (!failed) {
			return {
				pass: false,
				message: 'function should have failed exception'
			};
		}

		if (msg && actualMessage !== msg) {
      return {
        pass: false,
        message: `failed test: expected "${msg}" but was "${actualMessage}"`
      };
		}

    return {
      pass: true,
      message: ""
    };
	}
});

describe("the canto expect matchers", function() {

	it("should be defined", function() {
		expect(expectMatchers).toBeDefined();
	});

	it("should detect correct token types", function() {
		expect([
			{ content: "x", type:"y", line:1, character:1},
			{ content: "a", type:"b", line:1, character:2}
		]).toHaveTokenTypes(["y", "b"]);
	});

	it("should detect different token types", function() {
	    expect(function() {
			expect([
					{ content: "x", type:"y", line:1, character:1},
					{ content: "a", type:"b", line:1, character:2}
			]).toHaveTokenTypes(["y", "WRONG"]);
		}).toFailTest();
	});

	it("should detect correct token content", function() {
		expect([
			{ content: "x", type:"y", position:0},
			{ content: "a", type:"b", position:1}
		]).toHaveTokenContent(["x", "a"]);
	});

    it("should detect different token content", function() {
		expect(function() {
			expect([
					{ content: "x", type:"y", line:1, character:1},
					{ content: "a", type:"b", line:1, character:2}
			]).toHaveTokenTypes(["x", "WRONG"]);
		}).toFailTest("Expected token type 'x' but found 'y' at index 0");
	});

	it("should detect different lengths when checking types", function() {
		expect(function() {
            expect([ { content: "x", type:"y", position:0}, ]).toHaveTokenTypes([]);
		}).toFailTest("Expected 0 tokens but found 1");
	});

	it("should detect different lengths when checking content", function() {
		expect(function() {
			expect([{ content: "x", type:"y", position:0}]).toHaveTokenContent([]);
		}).toFailTest("Expected 0 tokens but found 1");
	});

	it("should give correct positions", function() {
		expect({ content: "a", type:"b", line:1, character:2}).toBeAt(1,2);
	});
});
