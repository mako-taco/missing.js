/* Object prototype */
Object.defineProperty(Object.prototype, 'clone', {
	value: function () {
		if(Array.isArray(this)) {
			result = []
		}
		else {
			var result = {};
		}
		
		for(key in this) {
			var val = this[key];

			//copy array
			if(Array.isArray(val)) {
				result[key] = val.slice().clone();
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
				result[key] = val.clone();
			}
			//copy primitive
			else {
				result[key] = val;
			}
		}
		return result;
	}
});

Object.defineProperty(Object.prototype, 'merge', {
	value: function (obj) {
		for(key in obj) {
			var next = obj[key];
			var current = this[key];
			if(Array.isArray(next)) {
				this[key] = next.slice().clone();
			}
			else if(next === null) {
				this[key] = next;
			}
			else if(next === undefined) {
				continue;
			}
			else if(typeof next === 'object') {
				if(current === null) {
					current = next.clone();
				}
				else if(typeof current === 'object') {
					current.absorb(next);
				}
				else if(current === undefined) {
					current = next.clone();
				}
			}
			else {
				this[key] = next;
			}	
		}
		return this;
	}
});

Object.defineProperty(Object.prototype, 'stringify', {
	value: function (replacer, space) {
		return JSON.stringify(this, replacer, space);
	}
});

/* HTMLElement prototype */
Object.defineProperty(HTMLElement.prototype, 'toString', {
	value: function () {
		return this.outerHTML;
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

/* 'as' Conversions */
(function () {
	var as = {};
	Object.defineProperties(as, {
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
							if(visited.contains(value)) {
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
		}
	});

	Object.defineProperty(Object.prototype, 'as', {
		get: function () {
			as.__value__ = this;
			return as;
		}
	})
}())