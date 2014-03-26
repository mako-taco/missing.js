"use strict";

if(typeof module != "undefined" && typeof module.exports != "undefined") {
	module.exports = {};
}

/* Object */
Object.defineProperty(Object, 'clone', {
	value: function (obj) {
		if(Array.isArray(obj)) {
			result = []
		}
		else {
			var result = {};
		}
		
		for(var key in obj) {
			var val = obj[key];

			//copy array
			if(Array.isArray(val)) {
				result[key] = Object.clone(val.slice());
			}
			//prevent weird typeof null == object
			else if(val === null) {
				result[key] = val;
			}
			//delete a key
			else if(val === undefined) {
				continue;
			}
			//clone object
			else if(typeof val === "object") {
				result[key] = Object.clone(val);
			}
			//copy primitive
			else {
				result[key] = val;
			}
		}
		return result;
	}
});

Object.defineProperty(Object, 'merge', {
	value: function (target, obj) {
		for(var key in obj) {
			var next = obj[key];
			var current = target[key];
			if(Array.isArray(next)) {
				target[key] = Object.clone(next.slice());
			}
			else if(next === null) {
				target[key] = next;
			}
			else if(next === undefined) {
				continue;
			}
			else if(typeof next === 'object') {
				if(current === null) {
					current = Object.clone(next);
				}
				else if(typeof current === 'object') {
					current.absorb(next);
				}
				else if(current === undefined) {
					current = Object.clone(next);
				}
			}
			else {
				target[key] = next;
			}	
		}
		return target;
	}
});

/* Object prototype */
Object.defineProperty(Object.prototype, 'stringify', {
	value: function (replacer, space) {
		return JSON.stringify(this, replacer, space);
	}
});

/* Array prototype */
Object.defineProperty(Array.prototype, 'remove', {
	value: function (obj) {
		var i = this.indexOf(obj);
		if(~i) {
			return this.splice(i,1)[0];
		}
		else {
			return false;
		}
	}
});

Object.defineProperty(Array.prototype, 'removeAll', {
	value: function (obj) {
		var removed = [];
		while(true) {
			var i = this.indexOf(obj);
			if(~i) {
				removed[removed.length] = this.splice(i,1);
			}
			else {
				break;
			}
		}
		return removed;
	}
});

Object.defineProperty(Array.prototype, 'contains', {
	value: function (obj) {
		var i = this.indexOf(obj);
		return !!~i;
	}
});

Object.defineProperty(Array.prototype, 'toString', {
	value: function () {
		return this.join(", ");
	}
});

/* String prototype */
Object.defineProperty(String.prototype, 'parse', {
	value: function (reviver) {
		return JSON.parse(this, reviver);
	}
});

/* 'to' Conversions */
(function () {
	var to = {};
	Object.defineProperties(to, {
		"string": {
			get: function () {
				var val = this.__value__, undefined;
				if(val.toString !== Object.prototype.toString) {
					return val.toString();
				}
				else if(val instanceof Object) {
					var visited = [];
					return JSON.stringify(val, function (key, value) {
						if(value instanceof Function) {
							return "[Function]";
						}
						else if(value instanceof Object) {
							if(~visited.indexOf(value)) {
								return "[Circular reference]";
							}
							else {
								visited[visited.length] = value;
								return value;
							}
						}
						else {
							return value;
						}
					}, "\t")
				}
				else if(val.toString !== undefined) {
					return val.toString();
				}
				else {
					return this.__value__ + "";
				}
			}
		},
		"int": {
			get: function () {
				return parseInt(this.__value__);
			}
		},
		"num": {
			get: function () {
				return parseFloat(this.__value__);
			}
		},
		"number": {
			get: function () {
				return this.__value__.to.num;
			}
		}
	});

	Object.defineProperty(Object.prototype, 'to', {
		get: function () {
			to.__value__ = this;
			return to;
		}
	})
})();

/* 'is' Evaluations */
(function () {
	var is = {};

	Object.defineProperties(is,  {
		"int": {
			get: function () {
				var val = this.__value__;
				return val.constructor === Number && (~~val === val);
			}
		},
		"number": {
			get: function () {
				var val = this.__value__;
				return val.constructor === Number;
			}
		},
		"array": {
			get: function () {
				return this.__value__.constructor === Array;
			}
		},
		"string": {
			get: function () {
				return this.__value__.constructor === String;
			}
		},
		"object": {
			get: function () {
				return this.__value__.constructor === Object;
			}
		},
		"numeric": {
			get: function () {
				return parseFloat(this.__value__) !== NaN;
			}
		},
		"NaN": {
			get: function () {
				return isNaN(this.__value__);
			}
		},
		"function": {
			get: function () {
				return this.__value__.constructor === Function;
			}
		},
		"undefined": {
			get: function () {
				var undefined;
				return this.__value__ === undefined;
			}
		},
		"null": {
			get: function () {
				return this.__value__ === null;
			}
		},
		"ok": {
			get: function () {
				return !!this.__value__;
			}
		},
		/* Aliases */
		"num": {
			get: function () {
				return this.number;
			}
		}
	});

	Object.defineProperty(Object.prototype, 'is', {
		get: function (arg) {
			var undefined;
			is.__value__ = this;
			if(arg === undefined) {
				return is;
			}
			else {
				return this instanceof arg;
			}
		}
	})
})();