require("mocha");
require("should");
require("../missing");

describe("clone", function () {
	it("should exist on object prototype", function () {
		Object.prototype.should.have.property("clone");
	})

	it("should deep copy an object", function () {
		var a = {a: 0};
		var b = a.clone();
		b.should.eql(a);
	})

	it("should work on objects with arrays as properties", function () {
		var a = {a: [1,2,3]};
		var b = a.clone();
		b.should.eql(a);
	})

	it("should work on objects with functions as properties", function () {
		var a = {a: function(){console.log("hi!")}};
		var b = a.clone();
		b.should.eql(a);
	})

	it("should work on objects with objects as properties", function () {
		var a = {a: {b: 4}};
		var b = a.clone();
		b.should.eql(a);
	})

	it("should deep copy object properties", function () {
		var a = {a: {b: 4}};
		var b = a.clone();
		a.a.should.not.equal(b.a);
	})

	it("should deep copy array proeprties", function () {
		var a = {a: [{b: 0}, 1, 2]};
		var b = a.clone();
		a.a.should.not.equal(b.a);
		a.a[0].should.eql(b.a[0]);
	})
});

describe("merge", function () {
	it("should exist on Object prototype", function () {
		Object.prototype.should.have.property("merge");
	})

	it("should add non-existing properties to the base object");

	it("should overwrite existing properties on the base object");

	it("should deep copy complex objects during merger");
});

describe("stringify", function () {
	it("should exist on String prototype", function () {
		String.prototype.should.have.property("stringify");
	})

	it("should stringify an object", function () {
		var a = {a: 0, b: 1};
		a.stringify().should.equal('{"a":0,"b":1}');
	})

	it("should accept a replacer argument", function () {
		var a = {a: 0, b: 1};
		var replacer = function (key, value) {
			if(key == "a") {
				return "OMG";
			}
			else {
				return value;
			}
		};
		a.stringify(replacer).should.equal('{"a":"OMG","b":1}');
		a.stringify(replacer).should.equal(JSON.stringify(a, replacer));
	})

	it("should accept a space argument");
});

describe("to", function () {
	it("should exist on Object prototype", function () {
		Object.prototype.should.have.property("to");
	})

	it("should convert strings to numbers", function () {
		var a = "23123.23";
		a.to.number.should.equal(23123.23);
	})

	it("should convert strings to ints", function () {
		var a = "23123.23";
		a.to.int.should.equal(23123);
	})

	it("should alias number as num", function () {
		var a = "23.3";
		a.to.num.should.eql(a.to.number);
	})
})

describe("is", function () {
	it("should exist on Object prototype", function () {
		Object.prototype.should.have.property("is");
	})
})