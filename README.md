![missing.js](https://s3.amazonaws.com/missing.js/missing.png "missing.js") missing.js
=========
Provides common prototypes with 'missing' functionality, such as the abilty to clone and merge objects, 
evaluate the type of an object, and the ability to convert an object of one type to another type.

- [Introduction](#introduction)
- [Object](#objectprototype)
 	- [clone](#objectclone)
 	- [merge](#objectmerge)
 	- [stringify](#objectstringify)
- [Array](#arrayprototype)
	- [remove](#arrayremove)
	- [removeAll](#arrayremoveall)
	- [contains](#arraycontains)
	- [toString](#arraytostring)
- [String](#stringprototype)
 	- [parse](#stringparse)
- [Type evaluation with `is`](#type-evaluation-with-is)
	- [int](#is-evaluation)
	- [number, num](#is-evaluation)
	- [array](#is-evaluation)
	- [string](#is-evaluation)
	- [object](#is-evaluation)
	- [numeric](#is-evaluation)
	- [NaN](#is-evaluation)
	- [function](#is-evaluation)
	- [undefined](#is-evaluation)
	- [null](#is-evaluation)
	- [ok](#is-evaluation)
- [Type conversion with `to`](#type-conversion-with-to)
 	- [int](#toint)
 	- [number, num](#tonumber)
 	- [string](#tostring)

####Introduction
```js
/*Without missing.js*/
function (a, b, c) {
	if(parseInt(a) !== a && !isNaN(a)) {
		throw new Error("`a` must be an integer");
	}
	else if(b.constructor !== String) {
		throw new Error("`b` must be a string");
	}
	else if(c !== null && (typeof c == 'object')) {
		throw new Error("`c` must be an object");
	}

	return $.extend(c, {a: a, b: b});
}

/*With missing.js*/
function (a, b, c) {
	if(!a.is.int) {
		throw new Error("`a` must be an integer");
	}
	else if(!b.is.string) {
		throw new Error("`b` must be a string");
	}
	else if(!c.is.object) {
		throw new Error("`c` must be an object");
	}

	return c.merge({a: a, b: b});
}
```
Getting set up is easy.
####Browser
```html
<script src="missing.js"></script>
```
####Node
```js
npm install missing
require('missing');
```

##Object.prototype
####Object.clone()
Creates a deep copy of the object
```js
var original = {arr: [0,2,3], b:{}, c: "hello"};
var copy = original.clone();
```
####Object.merge(obj)
Assimilates `obj` into this, deep copying any complex values of `obj` before merging them in.
Modifies the original object, and returns the original object after the merger.
```js
var original = {a: 1, b: 2, c: 3};
var other = {a: "existing key", d: "new key"};

var result = original.merge(other);
result === original; //true
original; // {a: "existing key", b: 2, c: 3, d: "new key"}
```

####Object.stringify([replacer, space])
Essentially the same as calling `JSON.stringfy(this, [replacer, space])`
```js
({a: 5}).stringify(); // "{'a': 5}"
```

##Array.prototype
####Array.toString()
```js
['a', 2, 'b'].toString(); // "['a', 2, 'b']"
//you will get a similar result if concatenating to a string
var str = "Hello" + ['there', 'world']; // "Hello ['there', 'world']"
```
####Array.remove(obj)
Removes the first instance of `obj` from the array, and returns it. If nothing was found, returns false.
####Array.removeAll(obj)
Removes all instances of `obj` from the array, and returns them as an array. If nothing was found, returns an empty array.
####Array.contains(obj)
Returns true if the object passed is inside of the array

##String.prototype 
####String.parse([reviver])
Essentially the same as `JSON.parse(this, [reviver])`

##`to` Conversion
Included in `missing.js` is a small object which attaches itself to `Object.prototype` called `to`.
This object allows you to easily retrieve the value of a variable as another type. This will leave the original
object intact. Think of `to` as a more fully fledged `toString()` or `toFixed()`, without the method call.
####to.string
Converts the object to a useful string
```js
var array = [1,2,3];
console.log(array.to.string); // "[1, 2, 3]"

var number = 52.332
console.log(number.to.string); // "52.332"

var object = {a: 5, b: {c: 0}};
console.log(object.to.string); //Pretty print + stringified
```
####to.int
Converts the object to an int, or NaN if it cannot be parsed
```js
var string = "1235";
string.to.int; // 1235

var num = 123.4442;
num.to.int; // 123
```
####to.num
Converts the object to a number, possibly with decimals

##`is` Evaluation
Similar to `to`, you may use `is` to determine if one object 'is' a certain type.
Available properties are listed below.
```js
var something = "50.2";
something.is.int //false		
something.is.number //false
something.is.string //true
something.is.function //false
something.is.object //false
something.is.numeric //true
something.is.NaN //false
something.is.undefined //false
something.is.null //false
something.is.num //false
```
