var hge = hge || {};
var duu = duu || {};

/* ~ */

var vs = vs || {};

window.vs.assert = function (test, msg) {
	if (!test) {
		window.vs.assert.args = arguments;
		if (confirm("assert failed (break?): "+msg)) {
			return;
		}
	}
};

/* ~ */

vs.defined = function (value) {
	return !(typeof value === "undefined");
};

vs.definedor = function (value, alternative) {
	return vs.defined(value) ? value : alternative;
};

vs.nonnullor = function (value, alternative) {
	return (value != null) ? value : alternative;
}

vs.emptied = function (value) {
	if (value instanceof Array) {
		return value.length == 0;
	} else if (value instanceof Obejct) {
		for (var key in value) {
			return false;
		}
		return true;
	}
	vs.assert(0, "unexpected value for emptiness check: "+value, value);
};

/* ~ */

vs.isString = function (value) {
	return typeof value === "string" || (value instanceof String);
}

/* ~ */

vs.args = function (collection, index) {
	index = index || 0;
	return Array.prototype.slice.call(collection, index);
};

vs.bind = function (target, func) {
	return function () {
		func.apply(target, vs.args(arguments));
	};
};

/* ~ */

vs.clone = function (obj) {
	if (obj instanceof Array) {
		var result = [];
		var count = obj.length;
		
		for (var i = 0; i < count; i++) {
			result[i] = vs.clone(obj[i]);
		}
		
		return result;
	} else if (obj instanceof Object) {
		var result = {};
		
		for (var k in obj) {
			result[k] = vs.clone(obj[k]);
		}
		
		return result;
	} else {
		var result = obj;
		return result;
	}
};

vs.keys = (function () {
var hasOwnProperty = Object.prototype.hasOwnProperty,
	hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
	dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	],
	dontEnumsLength = dontEnums.length
	
	return function (obj) {
		if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')
		
		var result = []
		
		for (var prop in obj) {
			if (hasOwnProperty.call(obj, prop)) result.push(prop)
		}
		
		if (hasDontEnumBug) {
			for (var i=0; i < dontEnumsLength; i++) {
				if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])
			}
		}
		return result
	}
})();

vs.kvproof = function (obj) {
	var kvs = vs.args(arguments, 1);
	var count = kvs.length;
	
	var result = true;
	
	for (var i = 0; i < count - 1; i+=2) {
		var k = kvs[i];
		var v = kvs[i+1];
		if (!vs.defined(obj[k])) {
			result = false;
			vs.assert(0, "kvproof failed: "+k+" is undefined", obj, k);
		}
		if (obj[k] == null) {
			obj[k] = obj[k] || v;
		}
	}
	
	return result;
};

vs.keyproof = function (obj) {
	var keys = vs.args(arguments, 1);
	var count = keys.length;
	
	var result = true;
	
	for (var i = 0; i < count; i++) {
		var k = keys[i];
		if (!vs.defined(obj[k])) {
			result = false;
			vs.assert(0, "keyproof failed: "+k+" is undefined", obj, k);
		}
	}
	
	return result;
};

vs.valueproof = function (obj) {
	var kvs = vs.args(arguments, 1);
	var count = kvs.length;
	
	for (var i = 0; i < count; i+=2) {
		var k = kvs[i];
		var v = kvs[i+1];
		if (obj[k] == null) {
			obj[k] = obj[k] || v;
		}
	}
};

/* ~ */

vs.enum = function (initial) {
	var core = {
	uuid:initial || 0,
	next:function () {
		return core.uuid++;
	},
	};
	return function () {
		return core;
	};
};

/* ~ */

vs.globalize = function (key, value) {
	window[key] = value;
};

/* ~ */

vs.log = function (level, msg) {
	var args = vs.args(arguments);
	msg = args.pop();
	level = args.pop();
	//if (level < 1)
	{
		console.log(msg);
	}
};

vs.logo = function (level, msg) {
	var args = vs.args(arguments);
	msg = args.pop();
	level = args.pop();
	
	vs.log(level, JSON.stringify(msg));
};

/* ~ */

vs.now = function () {
	return Date.now();
};

/* ~ */

vs.geom = vs.geom || {};
vs.geom.p = function (coord) {
	if (coord && coord.length) {
		return vs.geom.p.cp(coord);
	}
	return vs.geom.p.cp(arguments);
};
vs.geom.p.cp = function (point) {
	return Array.prototype.slice.call(point);
};
vs.geom.p.eq = function (a, b) {
	if (a.length != b.length) {
		return false;
	}
	
	var count = a.length;
	for (var i = 0; i < count; i++) {
		if (a[i] != b[i]) {
			return false;
		}
	}
	
	return true;
}



vs.geom.rect = function (point, dimension) {
	if (arguments.length > 2) {
		var args = vs.args(arguments);
		vs.assert(args.length % 2 == 0, "invalid argument count to rect construction", args);
		return [vs.geom.p(args.splice(0, args.length / 2)), vs.geom.p(args)];
	} else if (!dimension) {
		vs.assert(point instanceof Array, "point must be an Array if there is no dimension", point);
		vs.assert(point.length % 2 == 0, "invalid point element count to rect construction", point);
		return [vs.geom.p(point.splice(0, point.length / 2)), vs.geom.p(point)];
	} else if (dimension instanceof Array) {
		vs.assert(point instanceof Array, "point must be an Array if dimension is an Array", point);
		vs.assert(point.length == dimension.length, "point and dimension length must be equal", point, dimension);
		return [vs.geom.p(point), vs.geom.p(dimension)];
	} else {
		vs.assert(!(point instanceof Array), "point must not be an Array if dimension is not an Array", point);
		return [vs.geom.p(point), vs.geom.p(dimension)];
	}
};
vs.geom.rect.cp = function (rect) {
	return [vs.geom.p.cp(rect[0]), vs.geom.p.cp(rect[1])];
};
vs.geom.rect.eq = function (a, b) {
	return vs.geom.p.eq(a[0], b[0]) && vs.geom.p.eq(a[1], b[1]);
};



vs.geom.rgb = function () {
	var args = vs.args(arguments);
	return vs.geom.p.apply(this, args);
};
vs.geom.rgb.cp = function () {
	var args = vs.args(arguments);
	return vs.geom.p.cp.apply(this, args);
};
vs.geom.rgb.eq = function () {
	var args = vs.args(arguments);
	return vs.geom.p.eq.apply(this, args);
};

/* ~ */

vs.keytext = {};

vs.keytext.namespace = "hge";
vs.keytext.uuid = vs.keytext.namespace + "id";
vs.keytext.domain = vs.keytext.namespace + ".";
vs.keytext.task = vs.keytext.namespace + "";

vs.keytext.superior = vs.keytext.namespace + "$";
vs.keytext.gate = "#";
//vs.keytext.doublegate = "##";
vs.keytext.logger = vs.keytext.namespace + "<<";
vs.keytext.addresser = vs.keytext.namespace + "@";

/* ~ */

(function () { 

/*
var iframe = document.createElement("iframe");
iframe.style.display = "none";
document.documentElement.appendChild(iframe);

// write a script into the <iframe> and create the sandbox
frames[frames.length - 1].document.write(
	"<script>"+
	"parent.guardApply=Function.prototype.apply;"+
	"parent.guardCall=Function.prototype.call;"+
	"parent.guardCall=Array.prototype.slice;"+
	"<\/script>"
);

var apply$ = window.guardApply;
var call$ = window.guardCall;
var slice$ = window.guardSlice;

delete window.guardApply;
delete window.guardCall;
delete window.guardSlice;

var safe$ = function (func) {
	func.apply = apply$;
	func.call = call$;
	return func;
};

safe$(apply$);
safe$(call$);
safe$(slice$);

document.documentElement.removeChild(iframe);
*/

(function () {
	
	var Uniqueness = function (seed) {
		var guid = seed;
		
		if (guid !== null) {
			guid = (seed || 0) + 0;
		}
		
		return (function () {
			var _uuid = null;
			
			if (!(this.hasOwnProperty("ouuid")) ||
				!(this.ouuid instanceof Function)) {
				
				this.ouuid = function () {
					return _uuid;
				};
				
				if (guid !== null) {
					_uuid = ++guid;
				}
			}
		});
	};
	
	(function () {
		
		var uniques = {};
		
		var heisenberg = (function () {})();
		
		vs.validDomain = function (domain) {
			if (domain == null) {
				domain = null;
			}
			return domain;
		};
		
		var CommonRuled = Uniqueness(null);
		
		vs.Ruled = function (lookup, domain) {
			
			domain = vs.validDomain(domain);
			
			if (lookup == null) {
				lookup = null;
				domain = heisenberg;
			} else {
				vs.assert((lookup instanceof vs.Addresser), "ruler must be a valid addresser (or none at all)", lookup, this);
			}
			
			if (lookup) {
				var UniqueRuled = uniques[domain] = uniques[domain] || Uniqueness();
				
				UniqueRuled.call(this);
			} else {
				CommonRuled.call(this);
			}
			
			if (!(this.hasOwnProperty("odname")) ||
				!(this.odname instanceof Function)) {
				
				this.odname = function () {
					return domain;
				};
			}
			
			if (!(this.hasOwnProperty("oruler")) ||
				!(this.oruler instanceof Function)) {
				
				this.oruler = function () {
					return lookup;
				};
			}
		};
	})();
	
	var UniqueGuard = Uniqueness();
	
	vs.Guard = function () {
		UniqueGuard.call(this);
	};
	
	vs.Uniqueness = Uniqueness;
	
})();

(function () {
	
	vs.iface = function (target, interfaces) {
		var args = vs.args(arguments);
		target = args.shift();
		
		var count = args.length;
		for (var i = 0; i < count; i++) {
			interfaces = args[i];
			for (var key in interfaces) {
				target[key] = interfaces[key];
			}
		}
	};
	
	vs.papi = function (guard, ctor) {
		return ctor.prototype.opriv(guard);
	}
	
	vs.adapt = (function () {
		var employ = (function (guard) {
			if (!(this.hasOwnProperty("opriv")) ||
				!(this.opriv instanceof Function) ||
				this.opriv(token) !== secret) {
				
				this.opriv = (function () {
					var _priv = {};
					var _post = {};
					return function (grd) {
						if (!grd) {
						} else if (grd === token) {
							return secret;
						} else if (grd === dog) {
							return _post;
						} else if (grd === uber) {
							return _priv;
						} else if (grd.ouuid instanceof Function) {
							var gid = grd.ouuid();
							if (grd === _post[gid]) {
								return _priv[gid];
							}
						}
						
						return {};
					}
				})();
			}
			
			if (!(this.hasOwnProperty("ipriv")) ||
				!(this.ipriv instanceof Function) ||
				this.ipriv(token) !== secret) {
				
				this.ipriv = function (grd) {
					return vs.papi(grd, this.constructor);
				};
			}
			
			if (guard &&
				(guard instanceof Object) &&
				(guard.ouuid instanceof Function)) {
				var gkey = guard.ouuid();
				var gpost = this.opriv(dog);
				if (gpost) {
					if (gpost[gkey] == null) {
						gpost[gkey] = guard;
						return (this.opriv(uber)[gkey] = {});
					} else if (gpost[gkey] === guard) {
						return (this.opriv(uber)[gkey]);
					}
				}
			}
		});
		
		return (function (guard, config, parent) {
			
			var params = vs.args(arguments, 1);
			
			parent = params.pop();
			config = params.pop();
			
			vs.kvproof(
				config,
				"pdefs", null,
				"onnew", null,
				"ongen", null,
				"pfaces", null
			);
			
			var result = function () {
				var _priv = employ.call(this, guard);
				
				vs.iface(_priv, config.pdefs);
				
				if (config.onnew instanceof Function) {
					config.onnew.apply(this, vs.args(arguments));
				}
			};
			
			result.implementation = config.onnew;
			
			if (parent instanceof Function) {
				var support = function (vars) {
					parent.apply(this, vars);
				};
				support.prototype = parent.prototype;
				result.prototype = new support(params);
			}
			
			var _pface = employ.call(result.prototype, guard);
			
			result.adapt = function () {
				var vars = vs.args(arguments);
				vars.push(this); // "this" is the "parent" constructor
				return vs.adapt.apply(this, vars);
			};
			
			
			var helper = function (vars) {
				result.apply(this, vars);
			};
			helper.prototype = result.prototype;
			result.gen = function () {
				var obj = new helper(arguments);
				
				if (config.ongen instanceof Function) {
					config.ongen.apply(obj, arguments);
				}
				
				return obj;
			};
			
			vs.iface(_pface, config.pfaces);
			
			return result;
		});
	})();
	
	var dog = new vs.Guard();
	var uber = new vs.Guard();
	var token = new vs.Guard();
	var secret = new vs.Guard();
	
	vs.Target = vs.adapt(new vs.Guard(), {
		pdefs:null,
		pfaces:null,
		onnew:null,
		ongen:null,
	}, null);
})();

vs.Property = function (guard, result) {
	result = result || {};
	this.getter = function (name, field, sideeffect) {
		vs.assert(name.substr(0, 3) == "get" || name.substr(0, 2) == "is", "getter name without 'get' or 'is' prefix ("+name+" -- probably a typo)");
		if (field instanceof Array) {
			if (field.length > 1) {
				field = vs.clone(field);
				result[name] = function () {
					var pvars = this.opriv(guard);
					var current = pvars;
					var last = field.length - 1; // note the "-1"
					for (var i = 0; i < last; i++) {
						current = current[field[i]];
					}
					last = field[last];
					if (sideeffect instanceof Function) {
						sideeffect.call(this, current[last], name, field);
					}
					return current[last];
				};
				return this;
			} else {
				field = field[0];
			}
		}
		result[name] = function () {
			var pvars = this.opriv(guard);
			if (sideeffect instanceof Function) {
				sideeffect.call(this, pvars[field], name, field);
			}
			return pvars[field];
		};
		return this;
	};
	this.setter = function (name, field, sideeffect) {
		vs.assert(name.substr(0, 3) == "set", "setter name without 'set' prefix ("+name+" -- probably a typo)");
		if (field instanceof Array) {
			if (field.length > 1) {
				field = vs.clone(field);
				result[name] = function (value) {
					var pvars = this.opriv(guard);
					var current = pvars;
					var last = field.length - 1; // note the "-1"
					for (var i = 0; i < last; i++) {
						current = current[field[i]];
					}
					last = field[last];
					var previous = current[last];
					current[field] = value;
					if (sideeffect instanceof Function) {
						sideeffect.call(this, current[last], previous, name, field);
					}
					return this;
				};
				return this;
			} else {
				field = field[0];
			}
		}
		result[name] = function (value) {
			var pvars = this.opriv(guard);
			var previous = pvars[field];
			pvars[field] = value;
			if (sideeffect instanceof Function) {
				sideeffect.call(this, pvars[field], previous, name, field);
			}
			return this;
		};
		return this;
	};
	this.result = function () {
		return result;
	};
};

(function () {
	var guard = new vs.Guard();
	
	vs.Model = vs.Target.adapt(guard, {
		pdefs:null,
		pfaces:null,
		onnew:null,
		ongen:null,
	});
	
	vs.Entity = vs.Model.adapt(guard, {
		pdefs:null,
		pfaces:null,
		onnew:function (lookup, domain) {
			vs.Ruled.call(this, lookup, domain);
		},
		ongen:null,
	});
	
	var properties = (new vs.Property(guard,
	{
		enact:function (json, dns) {
			vs.assert(0, "we did it? "+JSON.stringify(json), this);
			return true;
		},
		task:function (tag, result) {
			result = result || {};
			result[vs.keytext.task] = tag;
			result[vs.keytext.uuid] = this.ouuid();
			// add domain if available
			if (this.odname()) {
				result[vs.keytext.domain] = this.odname();
			}
			// send task to bridge
			if (vs.api &&
				(vs.api.request instanceof Function)) {
				var request = {};
				request[vs.keytext.addresser] = result;
				vs.api.request(request);
			}
			return result;
		},
		degen:function (options) {
			return this.task("~", options);
		},
	}))
	.result();
	
	vs.iface(vs.Entity.prototype, properties);
})();

})();

/* ~ */

(function () {
	var guard = new vs.Guard();
	
	var piface = null;
	
	vs.Fabric = vs.Entity.adapt(guard, {
		pdefs:{
			_uri:null,
			_width:NaN,
			_height:NaN,
			_dirty:true,
		},
		pfaces:(new vs.Property(guard, {
			clean:function (config) {
				var pmems = this.opriv(guard);
				pmems._width = config.width;
				pmems._height = config.height;
				pmems._dirty = false;
			},
		}))
		.result(),
		onnew:function (lookup, domain, filepath) {
			vs.Entity.call(this, lookup, domain);
			
			var pmems = this.opriv(guard);
			pmems._uri = filepath || "";
		},
		ongen:function () {
			this.task("Fabric", {
				uri:this.getURI(),
				//width:this.getWidth(),
				//height:this.getHeight(),
			}, vs.bind(this, piface.clean));
		},
	});
	
	piface = vs.papi(guard, vs.Fabric);
	
	var properties = (new vs.Property(guard))
	.getter("isDirty", "_dirty")
	.getter("getURI", "_uri")
	.setter("setURI", "_uri", function (value, previous) {
		if (value != previous) {
			var pmems = this.opriv(guard);
			pmems._width = NaN;
			pmems._height = NaN;
			pmems._dirty = true;
			this.task("setURI", {
				uri:value,
			}, vs.bind(this, piface.clean));
		}
	})
	.getter("getWidth", "_width")
	//.setter("setWidth", "_width", function (value, previous) {
	//	if (value != previous) {
	//		this.task("setWidth", {
	//			width:value,
	//		});
	//	}
	//})
	.getter("getHeight", "_height")
	//.setter("setHeight", "_height", function (value, previous) {
	//	if (value != previous) {
	//		this.task("setHeight", {
	//			height:value,
	//		});
	//	}
	//})
	.result();
	
	vs.iface(vs.Fabric.prototype, properties);
})();

/* ~ */

(function () {
	var guard = new vs.Guard();
	
	var piface = null;
	
	// consider that nexus should not be an entity, but rather have an entity
	// and forward() calls matching entity's interface to its contained entity
	// this will improve composability of all "derived" types
	vs.Nexus = vs.Entity.adapt(guard, {
		pdefs:{
			_branch:null,
			_leaves:null,
			_ele:0,
			_code:null,
			_root:null,
			_loc:null,
			_magn:null,
			_ori:0,
		},
		pfaces:(new vs.Property(guard, {
			lazyLeaves:function () {
				var pmems = this.opriv(guard);
				return (pmems._leaves = (pmems._leaves || []));
			},
			insertLeaf:function (other, ele) {
				var nexus = null;
				var leaves = piface.lazyLeaves.call(this);
				var count = leaves.length;
				if (count > 0) {
					nexus = leaves[count - 1];
					if (nexus.getEle() > ele) {
						for (var i = 0; i < count; i++) {
							nexus = leaves[i];
							if (nexus.getEle() > ele) {
								leaves.splice(i, 0, other);
								break;
							}
						}
					}
				}
				leaves.push(other);
				other.setEle(ele);
			},
		}))
		.setter("setBranch", "_branch")
		.result(),
		onnew:function (lookup, domain) {
			vs.Entity.call(this, lookup, domain);
			
			var pmems = this.opriv(guard);
			pmems._root = vs.geom.p(0, 0);
			pmems._loc = vs.geom.p(0, 0);
			pmems._magn = vs.geom.p(1, 1);
		},
		ongen:function () {
			this.task("Nexus", {
				root:this.getRoot(),
				loc:this.getLoc(),
				magn:this.getMagn(),
				ele:this.getEle(),
				ori:this.getOri(),
				code:this.getCode(),
			});
		},
	});
	
	piface = vs.papi(guard, vs.Nexus);
	
	var properties = (new vs.Property(guard,
	{
		addLeaf:function (other, ele, code) {
			var pmems = this.opriv(guard);
			vs.assert(other, "leaf invalid", this, pmems, other);
			vs.assert(!other.getBranch(), "leaf not an orphan", this, pmems, other, other.getBranch());
			ele = vs.nonnullor(ele, other.getEle());
			code = vs.nonnullor(code, other.getCode());
			other.setCode(code);
			
			piface.insertLeaf.call(this, other, ele);
			
			piface.setBranch.call(other, this);
			
			var task = {
				leafId:other.ouuid(),
				ele:ele,
				code:code,
			};
			
			if (other.odname()) {
				result["leafDn"] = other.odname();
			}
			
			this.task("addLeaf", task);
		},
		getRoot:function () {
			var pmems = this.opriv(guard);
			return vs.geom.p.cp(pmems._root);
		},
		setRoot:function (point) {
			var pmems = this.opriv(guard);
			point = (point instanceof Array) ? vs.geom.p.cp(point) : vs.geom.p(arguments);
			if (!vs.geom.p.eq(pmems._root, point)) {
				pmems._root = point;
				
				this.task("setRoot", {
					root:point,
				});
			}
			
			return this;
		},
		getLoc:function () {
			var pmems = this.opriv(guard);
			return vs.geom.p.cp(pmems._loc);
		},
		setLoc:function (point) {
			var pmems = this.opriv(guard);
			point = (point instanceof Array) ? vs.geom.p.cp(point) : vs.geom.p(arguments);
			if (!vs.geom.p.eq(pmems._loc, point)) {
				pmems._loc = point;
				
				this.task("setLoc", {
					loc:point,
				});
			}
			
			return this;
		},
		getMagn:function () {
			var pmems = this.opriv(guard);
			return vs.geom.p.cp(pmems._magn);
		},
		setMagn:function (point) {
			var pmems = this.opriv(guard);
			point = (point instanceof Array) ? vs.geom.p.cp(point) : vs.geom.p(arguments);
			if (!vs.geom.p.eq(pmems._magn, point)) {
				pmems._magn = point;
				
				this.task("setMagn", {
					magn:point,
				});
			}
			
			return this;
		},
	}))
	.getter("getBranch", "_branch")
	.getter("getEle", "_ele")
	.setter("setEle", "_ele", function (value, previous) {
		if (value != previous) {
			this.task("setEle", {
				ele:value,
			});
		}
	})
	.getter("getCode", "_code")
	.setter("setCode", "_code")
	.getter("getOri", "_ori")
	.setter("setOri", "_ori", function (value, previous) {
		if (value != previous) {
			this.task("setOri", {
				ori:value,
			});
		}
	})
	.getter("getLeaves", "_leaves")
	.result();
	
	vs.iface(vs.Nexus.prototype, properties);
})();

/* ~ */

(function () {
	var guard = new vs.Guard();
	
	var piface = null;
	
	vs.Pixie = vs.Nexus.adapt(guard, {
		pdefs:{
			_box:null,
			_pigment:null,
			_density:1,
			_mirrorX:false,
			_mirrorY:false,
			_fabric:null,
		},
		pfaces:null,
		onnew:function (lookup, domain, fabric, box) {
			vs.Nexus.call(this, lookup, domain);
			
			var pmems = this.opriv(guard);
			pmems._fabric = fabric;
			pmems._pigment = vs.geom.rgb(1, 1, 1);
			
			if (box){
				pmems._box = vs.geom.rect.cp(box);
			} else if ((pmems._fabric instanceof vs.Fabric) &&
				!pmems._fabric.isDirty()) {
				pmems._box = vs.geom.rect(0, 0, pmems._fabric.getWidth(), pmems._fabric.getHeight());
			} else {
				pmems._box = vs.geom.rect(0, 0, 0, 0);
			}
		},
		ongen:function () {
			var task = {
				box:this.getBox(),
				pigment:this.getPigment(),
				density:this.getDensity(),
				root:this.getRoot(),
				loc:this.getLoc(),
				magn:this.getMagn(),
				ele:this.getEle(),
				ori:this.getOri(),
				code:this.getCode(),
			};
			
			var fabric = this.getFabric();
			
			if (fabric instanceof vs.Fabric) {
				task["fabricId"] = fabric.ouuid();
				
				if (pmems._fabric.odname()) {
					result["fabricDn"] = fabric.odname();
				}
			}
			
			this.task("Pixie", task);
		},
	});
	
	piface = vs.papi(guard, vs.Pixie);
	
	var properties = (new vs.Property(guard,
	{
		getBox:function () {
			var pmems = this.opriv(guard);
			var rect = vs.geom.rect.cp(pmems._box);
			if (pmems._mirrorX) {
				rect[0][0] += rect[1][0];
				rect[1][0] *= -1;
			}
			if (pmems._mirrorY) {
				rect[0][1] += rect[1][1];
				rect[1][1] *= -1;
			}
			return rect;
		},
		setBox:function (rect) {
			var pmems = this.opriv(guard);
			rect = (rect instanceof Array) ? vs.geom.rect.cp(rect) : vs.geom.rect(arguments);
			if (pmems._mirrorX && 
				rect[1][0] > 0) {
				rect[0][0] += rect[1][0];
				rect[1][0] *= -1;
			}
			if (pmems._mirrorY &&
				rect[1][1] > 0) {
				rect[0][1] += rect[1][1];
				rect[1][1] *= -1;
			}
			if (!vs.geom.rect.eq(pmems._box, rect)) {
				pmems._box = rect;
				
				this.task("setBox", {
					box:rect,
				});
			}
			return this;
		},
		getPigment:function () {
			var pmems = this.opriv(guard);
			return vs.geom.rgb.cp(pmems._pigment);
		},
		setPigment:function (rgb) {
			var pmems = this.opriv(guard);
			rgb = (rgb instanceof Array) ? vs.geom.rgb.cp(rgb) : vs.geom.rgb(arguments);
			if (!vs.geom.rgb.eq(pmems._pigment, rgb)) {
				pmems._pigment = rgb;
				
				this.task("setPigment", {
					pigment:rgb,
				});
			}
			
			return this;
		},
	}))
	.getter("getDensity", "_density")
	.setter("setDensity", "_density", function (value, previous) {
		if (value != previous) {
			this.task("setDensity", {
				density:value,
			});
		}
	})
	.getter("getMirrorX", "_mirrorX")
	.setter("setMirrorX", "_mirrorX", function (value, previous) {
		if (value != previous) {
			var pmems = this.opriv(guard);
			var rect = vs.geom.rect.cp(pmems._box);
			rect[0][0] += rect[1][0];
			rect[1][0] *= -1;
			this.setBox(rect);
		}
	})
	.getter("getMirrorY", "_mirrorY")
	.setter("setMirrorY", "_mirrorY", function (value, previous) {
		if (value != previous) {
			var pmems = this.opriv(guard);
			var rect = vs.geom.rect.cp(pmems._box);
			rect[0][1] += rect[1][1];
			rect[1][1] *= -1;
			this.setBox(rect);
		}
	})
	.getter("getFabric", "_fabric")
	.setter("setFabric", "_fabric", function (value, previous) {
		if (value != previous) {
			var task = {
				fabricId:(value ? value.ouuid() : 0),
			};
			
			if (value.odname()) {
				result["fabricDn"] = value.odname();
			}
			
			this.task("setFabric", task);
		}
	})
	.result();
	
	vs.iface(vs.Pixie.prototype, properties);
})();

/* ~ */

(function () {
	var guard = new vs.Guard();
	
	var piface = null;
	
	vs.Scape = vs.Nexus.adapt(guard, {
		pdefs:null,
		pfaces:null,
		onnew:function (lookup, domain) {
			vs.Nexus.call(this, lookup, domain, true);
			
			var pmems = this.opriv(guard);
		},
		ongen:function () {
			var task = {
				root:this.getRoot(),
				loc:this.getLoc(),
				magn:this.getMagn(),
				ele:this.getEle(),
				ori:this.getOri(),
				code:this.getCode(),
			};
			
			this.task("Surface", task);
		},
	});
	
	piface = vs.papi(guard, vs.Scape);
	
	var properties = (new vs.Property(guard, {
		run:function () {
			this.task("run", {
			});
		},
	}))
	.result();
	
	vs.iface(vs.Scape.prototype, properties);
})();

/* ~ */

(function () {
	var guard = new vs.Guard();
	
	var piface = null;
	
	vs.Zone = vs.Nexus.adapt(guard, {
		pdefs:null,
		pfaces:null,
		onnew:function (lookup, domain) {
			vs.Nexus.call(this, lookup, domain);
			
			var pmems = this.opriv(guard);
		},
		ongen:function () {
			var task = {
				root:this.getRoot(),
				loc:this.getLoc(),
				magn:this.getMagn(),
				ele:this.getEle(),
				ori:this.getOri(),
				code:this.getCode(),
			};
			
			this.task("Field", task);
		},
	});
	
	piface = vs.papi(guard, vs.Zone);
	
	var properties = (new vs.Property(guard))
	.result();
	
	vs.iface(vs.Zone.prototype, properties);
})();

/* ~ */

(function () {
	
	var emptyf = function () {};
	
	var guard = guard || new vs.Guard();
	
(function () {
	
	var piface = null;
	
	vs.Worker = vs.Target.adapt(guard, {
		pdefs:{
			_alias:null,
			_init:null,
			_term:null,
			_digest:null,
			_report:null,
			_superior:null,
		},
		pfaces:(new vs.Property(guard, {
			impReport:function (json, purify) {
				var pmems = this.opriv(guard);
				
				var product = {};
				product[pmems._alias] = json;
				
				return product;
			},
		}))
		.result(),
		onnew:function (config) {
			
			config = config || {};
			
			vs.kvproof(
				config,
				"alias", "anon",
				"init", null,
				"term", null,
				"digest", null,
				"report", piface.impReport
			);
			
			var pmems = this.opriv(guard);
			pmems._alias = config.alias;
			pmems._init = config.init;
			pmems._term = config.term;
			pmems._digest = config.digest;
			pmems._report = config.report;
		},
		ongen:null,
	});
	
	piface = vs.papi(guard, vs.Worker);
	
	var properties = (new vs.Property(guard, {
		init:function () {
			var pmems = this.opriv(guard);
			if (!pmems._init) {
				return;
			}
			return pmems._init.apply(this, arguments);
		},
		term:function () {
			var pmems = this.opriv(guard);
			if (!pmems._term) {
				return;
			}
			return pmems._term.apply(this, arguments);
		},
		consume:function (json) {
			var pmems = this.opriv(guard);
			if (!pmems._digest) {
				return false;
			}
			
			var result = true;
			
			if (json instanceof Array) {
				var count = json.length;
				for (var i = 0; i < count; i++) {
					result = pmems._digest.call(this, json[i]) && result;
				}
			} else if (json instanceof Object) {
				result = pmems._digest.call(this, json) && result;
			}
			
			return result;
		},
		produce:function (json, purify) {
			var pmems = this.opriv(guard);
			
			if (pmems._superior) {
				
				var product = this.report(json, purify);
				
				pmems._superior.produce(product, false);
				
				return true;
			}
			
			return false;
		},
		report:function (json, purify) {
			var pmems = this.opriv(guard);
			
			var args = arguments;
			
			if (purify) {
				json = vs.clone(json);
				args = vs.args(arguments, 1);
				args.unshift(json);
			}
			
			if (pmems._report) {
				json = pmems._report.apply(this, args);
			}
			
			return json;
		},
	}))
	.getter("getAlias", "_alias")
	.getter("getSuperior", "_superior")
	.result();
	
	vs.iface(vs.Worker.prototype, properties);
})();

	var guard = guard || new vs.Guard();
	
(function () {
	
	var piface = null;
	
	vs.Superior = vs.Worker.adapt(guard, {
		alias:null,
		init:null,
		term:null,
		digest:null,
		report:null,
	},
	{
		pdefs:{
			_hires:null,
			_assistant:null,
		},
		pfaces:(new vs.Property(guard, {
			impInit:function () {
				var pmems = this.opriv(guard);
				
				for (var alias in pmems._hires) {
					var worker = pmems._hires[alias];
					worker.open.apply(worker, arguments);
				}
				
				return true;
			},
			impTerm:function () {
				var pmems = this.opriv(guard);
				
				var result = {};
				
				var keys = vs.keys(pmems._hires);
				var count = keys.length;
				
				// copy the keys because removeWorker may modify pmems._hires (unnecessary safety?)
				for (var i = 0; i < count; i++) {
					var alias = keys[i]
					var worker = this.removeWorker(alias);
					
					if (worker) {
						result[alias] = worker;
					}
				}
				
				vs.assert(!pmems._assistant, "leaking on superiors assistant", pmems._assistant, this);
				
				return result;
			},
			impDigest:function (json) {
				var pmems = this.opriv(guard);
				
				var result = true;
				
				for (var alias in json) {
					var worker = pmems._hires[alias];
					if (worker) {
						result = worker.consume(json[alias]) && result;
						continue;
					}
					result = false;
					vs.assert(0, "unhandled work request", alias, json, pmems._hires, this);
				}
				
				return result;
			},
		}))
		.result(),
		onnew:function (config) {
			
			config = config || {};
			
			vs.kvproof(
				config,
				"alias", vs.keytext.superior,
				"init", piface.impInit,
				"term", piface.impTerm,
				"digest", piface.impDigest,
				"report", null
			);
			
			vs.Worker.call(this, config);
			
			var pmems = this.opriv(guard);
			pmems._hires = {};
		},
		ongen:null,
	});
	
	piface = vs.papi(guard, vs.Superior);
	
	var properties = (new vs.Property(guard, {
		addWorker:function (worker) {
			var pmems = this.opriv(guard);
			var alias = worker.getAlias();
			
			if (pmems._hires[alias] != null) {
				if (pmems._hires[alias] === worker) {
					return true;
				}
				vs.assert(0, "worker collision on name "+alias, this, worker, pmems._hires);
				return false;
			}
			
			var omems = worker.opriv(guard);
			if (omems._superior != null) {
				vs.assert(0, "worker already has an superior "+omems._superior.alias, this, worker, omems._superior);
				return false;
			}
			
			pmems._hires[alias] = worker;
			omems._superior = this;
			worker.open.apply(worker, vs.args(arguments, 1));
			
			return true;
		},
		removeWorker:function (alias) {
			var pmems = this.opriv(guard);
			
			var worker = pmems._hires[alias];
			
			if (!worker) {
				return null;
			}
			
			var omems = worker.opriv(guard);
			if (omems._superior != this) {
				worker.close.apply(worker, vs.args(arguments, 1));
				omems._superior = null;
			} else {
				vs.assert(0, "worker has an superior that is not this object: "+omems._superior.alias, this, worker, omems._superior);
			}
			
			delete pmems._hires[alias];
			
			if (pmems._assistant === worker) {
				pmems._assistant = null;
			}
			
			return worker;
		},
		setAssistant:function (helper) {
			var pmems = this.opriv(guard);
			if (pmems._assistant) {
				if (pmems._assistant === helper) {
					return true;
				}
				vs.assert(0, "this superior already has an assistant", helper, pmems._assistant, this);
				return false;
			}
			
			if (this.addWorker(helper)) {
				return true;
			}
			
			vs.assert(0, "failed to hire assistant", helper, pmems._hires, this);
			return false;
		},
		escalate:function (json, purify) {
			var superior = this.getSuperior();
			if (superior &&
				this === superior.getProductHelper()) {
				
				var product = this.report(json, purify);
				return superior.escalate(product, false);
			} else {
				// potential infinite loop if assistant is itself a Superior but has no assistant itself
				return vs.Worker.prototype.produce.call(this, json, purify);
			}
		},
		produce:function (json, purify) {
			var pmems = this.opriv(guard);
			var helper = pmems._assistant;
			
			if (!helper) {
				return this.escalate(json, purify);
			}
			
			return helper.produce(json, purify);
		},
		brief:function () {
			return vs.Worker.prototype.report.call(this, json, purify);
		},
		report:function (json, purify) {
			var pmems = this.opriv(guard);
			var helper = pmems._assistant;
			
			if (!helper) {
				return this.brief();
			}
			
			return helper.report(json, purify);
		},
	}))
	.getter("getAssistant", "_assistant")
	.result();
	
	vs.iface(vs.Superior.prototype, properties);
})();

	var guard = guard || new vs.Guard();
	
(function () {
	
	var piface = null;
	
	vs.Interface = vs.Superior.adapt(guard, {
		alias:null,
		init:null,
		term:null,
		digest:null,
		report:null,
	},
	{
		pdefs:null,
		pfaces:null,
		onnew:function (config) {
			
			config = config || {};
			
			vs.kvproof(
				config,
				"alias", null,
				"init", null,
				"term", null,
				"digest", null,
				"report", null
			);
			
			vs.Superior.call(this, config);
			
			var pmems = this.opriv(guard);
		},
		ongen:null,
	});
	
	piface = vs.papi(guard, vs.Interface);
	
	var properties = (new vs.Property(guard, {
		handle:function (message) {
			
			var json = null;
			
			try {
				json = JSON.parse(message);
			} catch (e) {}
			
			this.consume(json);
		},
		flush:function () {
			
			var json = null;
			
			try {
				json = JSON.stringify(this.report(json, false));
			} catch (e) {
				json = "null";
			}
			
			return json;
		},
	}))
	.result();
	
	vs.iface(vs.Interface.prototype, properties);
})();

	var guard = guard || new vs.Guard();
	
(function () {
	
	var piface = null;
	
	vs.Gate = vs.Worker.adapt(guard, {
		alias:null,
		init:null,
		term:null,
		digest:null,
		report:null,
	},
	{
		pdefs:{
			_mainQueue:null,
			_offQueue:null,
		},
		pfaces:(new vs.Property(guard, {
			impTerm:function () {
				var pmems = this.opriv(guard);
				pmems._mainQueue.splice(0, pmems._mainQueue.length);
				pmems._offQueue.splice(0, pmems._offQueue.length);
			},
			impDigest:function (json) {
				var pmems = this.opriv(guard);
				
				var temp = null;
				
				// indicate flush fulfillment to requester
				this.produce(json);
				
				vs.assert(
					pmems._offQueue.length <= 0, 
					"unexpected (but not catastrophic) gate flush request when off queue is not empty (investigate why)", 
					pmems._offQueue, 
					this
				);
				// clear what will become the main queue
				piface.clear.call(this);
				
				temp = pmems._offQueue;
				pmems._offQueue = pmems._mainQueue;
				pmems._mainQueue = temp;
				temp = pmems._offQueue;
				
				var superior = this.getSuperior();
				
				if (superior) {
					if (superior.escalate(temp, false)) {
						// matters were escalated, no longer responsible
						piface.clear.call(this);
					}
				} else {
					vs.assert(0, "gates should really always have superiors . . . but this one does not", this);
				}
				
				return true;
			},
			clear:function () {
				var pmems = this.opriv(guard);
				return pmems._offQueue.splice(0, pmems._offQueue.length);
			},
		}))
		.result(),
		onnew:function (config) {
			
			config = config || {};
			
			vs.kvproof(
				config,
				"alias", vs.keytext.gate,
				"init", null,
				"term", piface.impTerm,
				"digest", piface.impDigest,
				"report", null
			);
			
			vs.Worker.call(this, config);
			
			var pmems = this.opriv(guard);
			pmems._mainQueue = [];
			pmems._offQueue = [];
		},
		ongen:null,
	});
	
	piface = vs.papi(guard, vs.Gate);
	
	var properties = (new vs.Property(guard, {
		produce:function (json, purify) {
			var pmems = this.opriv(guard);
			
			if (purify) {
				json = vs.clone(json);
			}
			
			pmems._mainQueue.push(json);
			
			return true;
		},
		report:function (json, purify) {
			// matters were reported, no longer responsible
			return piface.clear.call(this);
		},
	}))
	.result();
	
	vs.iface(vs.Gate.prototype, properties);
})();

	var guard = guard || new vs.Guard();
	
(function () {
	
	var piface = null;
	
	vs.Addresser = vs.Worker.adapt(guard, {
		alias:null,
		init:null,
		term:null,
		digest:null,
		report:null,
	},
	{
		pdefs:{
			_registry:null,
			_dns:null,
		},
		pfaces:(new vs.Property(guard, {
			impTerm:function () {
				// TODO: . . .
			},
			impDigest:function (json) {
				var pmems = this.opriv(guard);
				
				var uuid = json[vs.keytext.uuid];
				var domain = json[vs.keytext.domain];
				var task = json[vs.keytext.task];
				
				var entity = pmems._registry.whois(domain, uuid);
				
				if (!entity) {
					vs.assert(0, "message unexpectedly sent to unassigned register "+domain+"/"+uuid);
					return false;
				}
				
				return entity.enact(json, pmems._dns);
			},
		}))
		.result(),
		onnew:function (config) {
			
			config = config || {};
			
			vs.assert((config.dns instanceof vs.Addresser.DNS), "addresser needs a valid dns: "+config.dns, config.dns, config, this);
			vs.assert((config.registry instanceof vs.Addresser.Registry), "addresser needs a valid registry: "+config.registry, config.registry, config, this);
			
			vs.kvproof(
				config,
				"alias", vs.keytext.addresser,
				"init", null,
				"term", piface.impTerm,
				"digest", piface.impDigest,
				"report", null
			);
			
			vs.Worker.call(this, config);
			
			var pmems = this.opriv(guard);
			pmems._registry = config.registry;
			pmems._dns = config.dns;
		},
		ongen:null,
	});
	
	piface = vs.papi(guard, vs.Addresser);
	
	var properties = (new vs.Property(guard, {
		whois:function (domain, uuid) {
			var pmems = this.opriv(guard);
			
			domain = vs.validDomain(domain);
			
			var registry = pmems._registry[domain] = pmems._registry[domain] || {};
			
			return registry[uuid];
		},
	}))
	.result();
	
	vs.iface(vs.Addresser.prototype, properties);
	
})();

})();





(function () {

	vs.Addresser.DNS = function (table) {
		
		vs.assert((table instanceof vs.Addresser.Registry), "dns needs a valid registry", table, this);
		
		var _registry = table;
		
		this.whois = function () {
			return _registry.whois.apply(_registry, arguments);
		};
	}
	
	vs.Addresser.Registry = function () {
		var _records = {};
		
		var safeListing = function (domain) {
			domain = vs.validDomain(domain);
			
			return _records[domain] = _records[domain] || {};
		};
		
		this.whois = function (domain, uuid) {
			var listing = safeListing(domain);
			
			return listing[uuid];
		};
		
		this.assign = function (owner, domain, uuid) {
			if (owner == null) {
				vs.assert(0, "no valid owner provided for assignment (requests to clear records should invoke revoke() instead)");
				return false;
			} else if (!(owner instanceof vs.Entity)) {
				vs.assert(0, "only valid entities may be assigned", owner);
				return false;
			}
			
			var listing = safeListing(domain);
			
			if (vs.defined(listing[uuid])) {
				if (listing[uuid] === owner) {
					return true;
				}
				vs.assert(0, "register "+domain+"/"+uuid+" already assigned", listing[uuid], uuid, domain, owner);
				return false;
			}
			
			listing[uuid] = owner;
			
			return true;
		};
		
		this.revoke = function (owner, domain, uuid) {
			var listing = safeListing(domain);
			
			if (!vs.defined(listing[uuid])) {
				vs.assert(0, "register "+domain+"/"+uuid+" is not assigned", listing, uuid, domain, owner);
				return false;
			} else if (listing[uuid] !== owner) {
				vs.assert(0, "register "+domain+"/"+uuid+" is not assigned to the specified owner", listing[uuid], uuid, domain, owner);
				return false;
			}
			
			delete listing[uuid];
			
			return true;
		};
	};
})();

/* ~ */

var duu = duu ? duu : {};

var duuf = duu.def = function (path, value) {
	
	if (!(path instanceof String) &&
		typeof path !== "string")
	{
		return false;
	}
	
	value = value || {};
	
	var namespaceToUse = this;
	
	if (!(namespaceToUse instanceof Object))
	{
		return false;
	}
	
	var parts = path.split("."); // split the path by periods
	var size = parts.length;
	
	var i;
	var p;
	
	for (i = 0; i < (size - 1); i++)
	{
		p = parts[i];
		
		if (!(namespaceToUse[p] instanceof Object) &&
			namespaceToUse[p] != null)
		{
			return false; // cannot overwrite existing path
		}
		
		namespaceToUse[p] = namespaceToUse[p] || {};
		
		namespaceToUse = namespaceToUse[p];
	}
	
	p = parts[parts.length - 1];
	
	value = namespaceToUse[p] || value;
	
	namespaceToUse[p] = value;
	
	return true;
};



duu.debug = true;

printStackTraceInitialization();

duu.log = 
function (msg)
{
	if (duu.debug === true)
	{
		console.log(msg);
	}
}

duu.logo = 
function (obj)
{
	if (duu.debug === true)
	{
		duu.log(JSON.stringify(obj));
	}
};

duu.printStackTrace = printStackTrace;

duu.trace = 
function ()
{
	if (duu.debug === true)
	{
		duu.log("\n" + printStackTrace().join("\n") + "\n");
	}
};

duu.alert = true;
duu.expose = null;

duu.assert = duu.assert ? duu.assert : function (statement, message, priority, valueN)
{
	if (!statement) {
		//if (priority >= 0)
		{
			//duu.trace();
			try {
				message = JSON.stringify(message);
			}
			catch (e)
			{
			}
			message = message && message.toString ? message.toString() : message;
			
			duu.expose = Array.prototype.slice.call(arguments, 3);
			
			if (duu.alert)
			{
				var show_trace = confirm("ASSERTION FAILED! " + message);
				
				if (show_trace)
				{
					var debug_cache = duu.debug;
					duu.debug = true;
					duu.trace();
					duu.debug = debug_cache;
					confirm("ASSERT: " + printStackTrace());
				}
			}
			
			return false;
		}
		
		return false;
	}
	
	return true;
};

duu.defined = function ()
{
	var count = arguments.length;
	
	for (var i = 0; i < count; i++)
	{
		if (typeof arguments[i] === "undefined")
		{
			return false;
		}
	}
	
	return true;
};

duu.is = function(obj, type) {
	if (obj instanceof type)
	{
		return true;
	}
	
	var k, result = true, op = obj.prototype, tp = type.prototype;
	
	for (k in tp)
	{
		b = op[k];
		
		if (!b)
		{
			break;
		}
	}
	
	return result;
};

duu.have_own_function = function (obj, name) {
	return (obj.hasOwnProperty(name) && (obj[name] instanceof Function));
};


















(
function() {

var p_id = 0;
var common_pool = {};

duu.Pool = function () {
	
	
	
};

duu.Pool.enable = function (type, onpool, onunpool, debug) {
	
	var pool;
	
	if (!(type instanceof Object))
	{
		duu.assert(false, "cannot pool non-object types");
	}
	
	if (type.poolid == null &&
		type.pool  == null &&
		type.unpool == null)
	{
		type.poolid = p_id++;
		
		pool = common_pool[type.poolid] = new duu.Pool();
		
		type.pool = function (obj, key) 
		{
			var result = pool.put(obj, key);
			
			if (debug instanceof Function)
			{
				debug(type, pool.size(), true, obj);
			}
			
			if (result === true)
			{
				if (onpool instanceof Function)
				{
					onpool.call(obj);
				}
			}
			
			return result;
		};
		
		type.unpool = function (key) 
		{
			var obj = pool.get(key);
			
			if (debug instanceof Function)
			{
				debug(type, pool.size(), false, obj);
			}
			
			if (obj != null &&
				obj instanceof Object)
			{
				if (onunpool instanceof Function)
				{
					onunpool.call(obj);
				}
			}
			
			return obj;
		};
	}
	else
	{
		duu.assert(false, "tried to enable pull on a type for which pool functionality may already exists");
	}
};

duu.Pool.prototype.size = function (key)
{
	return this[key] ? this[key].length : 0;
};

duu.Pool.prototype.put = function (obj, key)
{
	if (key == "put" ||
		key == "get")
	{
		return false;
	}
	
	if (!(this[key] instanceof Array))
	{
		this[key] = [];
	}
	
	this[key].push(obj);
	
	return true;
};

duu.Pool.prototype.get = function (key)
{
	if (key == "put" ||
		key == "get")
	{
		return null;
	}
	
	if (!(this[key] instanceof Array))
	{
		return null;
	}
	
	return this[key].pop();
};

var guid = 0;

duu.checker = [[],[]];

duu.Unique = function() {
	
	var uuid;
	if (!this.hasOwnProperty("duuid"))
	{
		if (duu.debug) {
			duu.checker[0].push(guid);
			duu.checker[1].push(this);
		}
		
		uuid = guid++;
		
		this.duuid = function() { return uuid; };
	}
	else if (!(this.duuid instanceof Function))
	{
		duu.assert(false, "DUUID location already taken!  Naming convention collision");
	}
};

duu.Guard = function () {
	duu.Unique.call(this);
};

var token_guard = new duu.Guard();
var secret_guard = new duu.Guard();
var head_guard = new duu.Guard();

function did_mixin(type, obj) {
	
	if (obj instanceof type)
	{
		return true;
	}
	
	if (!(obj.dmxns instanceof Function))
	{
		return false;
	}
	
	var mxns = obj.dmxns(head_guard);
	
	duu.assert((mxns instanceof Array), "mixins were not in array format", mxns);
	
	var count = mxns.length;
	
	for (var i = 0; i < count; i++)
	{
		if (mxns[i] === type)
		{
			// already a registered mixin
			return true;
		}
	}
	
	return false;
};

duu.mixedin = did_mixin;

function add_mixin(type, obj) {

	if (!(obj.dmxns instanceof Function))
	{
		return false;
	}
	
	if (!did_mixin(type, obj))
	{
		obj.dmxns(head_guard).push(type);
	}
};

duu.Base = function (guard) {
	
	// BE ADVISED -- private vars in a constructor DO NOT work for prototype objects (therefore a new duu.Base is not appropriate to use as a prototype)
	
	if (guard != null &&
		!(guard instanceof duu.Guard))
	{
		duu.assert(false, "duu.Bases must have a duu.Guard or no guard at all", guard);
		return;
	}
	
	var head_priv = (duu.have_own_function(this, "dpriv") && this.dpriv(token_guard) === secret_guard) ? this.dpriv(head_guard) : {}; // validation of function authenticity
	var priv = (guard != null) ? guard.duuid() : head_guard.duuid();
	head_priv[priv] = head_priv[priv] ? head_priv[priv] : {};
	priv = head_priv[priv];
	
	if (!this.hasOwnProperty("dpriv"))
	{
		this.dpriv = function (grd) {
			if (grd === token_guard) { return secret_guard }; // validation of function authenticity -- no where else can a function be written to return secret_guard
			if (grd === head_guard) { return head_priv; }
			if (grd === guard) { return priv; }
			if (grd instanceof duu.Guard) { duu.assert(head_priv[grd.duuid()] != null, "multipriv failure!");  return head_priv[grd.duuid()]; }
			duu.assert(false, "private access authentication failed", grd);
		};
	}
	else if (!(this.dpriv instanceof Function))
	{
		duu.assert(false, "PRIV location already taken!  Naming convention collision");
	}
	
	// mixins could better leverage prototype chaining...
	
	var mxns = (duu.have_own_function(this, "dmxns") && this.dmxns(token_guard) === secret_guard) ? this.dmxns(head_guard) : null; // one time validation of function authenticity
	if (mxns == null) {
		mxns = ((this.constructor.prototype.dmxns instanceof Function) && this.constructor.prototype.dmxns(token_guard) === secret_guard) ? this.constructor.prototype.dmxns(head_guard).slice(0) : [];
	}
	
	if (!this.hasOwnProperty("dmxns"))
	{
		this.dmxns = function (grd) {
			if (grd === token_guard) { return secret_guard; } // validation of function authenticity -- no where else can a function be written to return secret_guard
			if (grd === head_guard) { return mxns; }
			duu.assert(false, "mixins access authentication failed", grd);
		};
	}
	else if (!(this.dmxns instanceof Function))
	{
		duu.assert(false, "MXNS location already taken!  Naming convention collision");
	}
	
	
	duu.mixin(duu.Unique, this);
	add_mixin(duu.Base, this);
	
};

duu.mixin = function (type, obj){
	
	if (!(obj instanceof Object))
	{
		duu.assert(false, "cannot mixin on non-object", obj);
		return false;
	}
	
	if (!(type instanceof Function))
	{
		duu.assert(false, "cannot mixin with non-constructor", type);
		return false;
	}
	
	var args = Array.prototype.slice.call(arguments, 2);
	
	type.apply(obj, args);
	
	add_mixin(type, obj);
	
	return true;
};

} )();

duu.Base.fieldname = function (map) {
	
	var fn = {
		field:map,
		name:map,
	};
	
	if (map instanceof Object)
	{
		for (var k in map)
		{
			fn.field = map[k];
			fn.name = k;
			
			break; // only allow 1
		}
	}
	
	return fn;
};

duu.Base.getter = function (on, map, grd, aftercall) {
	
	var text = "duu.Base.getter";
	
	// technically (and especially in the case of extending a prototype) "on" does not need to be a duu.Base
	
	//if (!(on instanceof Object) ||
	//	!(on.dpriv instanceof Function))
	//{
	//	duu.assert(false, text+" can only be applied to duu.Base mixers", on);
	//	return;
	//}
	
	var fn = duu.Base.fieldname(map);
	
	var name = "get_"+fn.name;
	var field = fn.field;
	
	if (field == null) {
		duu.assert(false, text+" given invalid field: " + field, on);
		return;
	}
	
	if (on[name] != null) {
		duu.assert(false, text+"  given existing name: " + name, on);
		return;
	}
	
	on[name] = duu.wrap( function (skipAftercall) {
		
		var that = this;
		var priv = that.dpriv(grd);
		
		var value = (field instanceof Function) ? field(that, priv) : priv[field];
		
		if (skipAftercall !== true &&
			(aftercall instanceof Function))
		{
			value = aftercall.call(this, value, priv, field);
		}
		
		return value;
	} );
	
};

duu.Base.setter = function (on, map, grd, aftercall) {
	
	var text = "duu.Base.setter";
	
	// technically (and especially in the case of extending a prototype) "on" does not need to be a duu.Base
	
	//if (!(on instanceof Object) ||
	//	!(on.dpriv instanceof Function))
	//{
	//	duu.assert(false, text+" can only be applied to duu.Base mixers", on);
	//	return;
	//}
	
	var fn = duu.Base.fieldname(map);
	
	var name = "set_"+fn.name;
	var field = fn.field;
	
	if (field == null) {
		duu.assert(false, text+" given invalid field: " + field, on);
		return;
	}
	
	if (on[name] != null) {
		duu.assert(false, text+"  given existing name: " + name, on);
		return;
	}
	
	on[name] = duu.wrap( function (to, skipAftercall) {
		
		var that = this;
		var priv = that.dpriv(grd);
		
		if (field instanceof Function)
		{
			var from = field(that, priv);
			
			if (from == to)
			{
				return;
			}
			
			field(that, priv, to);
		}
		else
		{
			var from = priv[field];
			
			if (from == to)
			{
				return;
			}
			
			priv[field] = to;
		}
		
		if (skipAftercall !== true &&
			(aftercall instanceof Function))
		{
			aftercall.call(this, to, from, priv, field);
		}
	} );
	
};

duu.build_case = function (func) {
	
	if (!(func instanceof Function))
	{
		duu.assert(false, "cannot build a case with an invalid (function) argument (lol)");
	}
	
	
	
	var result = function () {
		
		var args = Array.prototype.slice.call(arguments, 0);
		
		var closingStatements = [];
		
		closingStatements.present = function () {
			
			var count = closingStatements.length;
			
			for (var i = 0; i < count; i++)
			{
				var statement = closingStatements.shift();
				
				if (!(statement instanceof Function))
				{
					duu.assert(false, "closing statement was not a function…", statement);
					continue;
				}
				
				statement();
			}
		};
		
		args.push(closingStatements);
		
		func.apply(null, args);
		
		closingStatements.present();
	};
	
	return result;
};

duu.ptype = function (type, after)
{
	type.prototype = after;
	type.prototype.constructor = type;
};




















// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Oyvind Sean Kinsey http://kinsey.no/blog (2010)
//                  Victor Homyakov <victor-homyakov@users.sourceforge.net> (2010)

/**
 * Main function giving a function stack trace with a forced or passed in Error
 *
 * @cfg {Error} e The error to create a stacktrace from (optional)
 * @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
 * @return {Array} of Strings with functions, lines, files, and arguments where possible
 */
function printStackTrace(options) {
    options = options || {guess: true};
    var ex = options.e || null, guess = !!options.guess;
    var p = new printStackTrace.implementation(), result = p.run(ex);
    return (guess) ? p.guessAnonymousFunctions(result) : result;
}

function printStackTraceInitialization() {

printStackTrace.implementation = function() {
};

printStackTrace.implementation.prototype = {
    /**
     * @param {Error} ex The error to create a stacktrace from (optional)
     * @param {String} mode Forced mode (optional, mostly for unit tests)
     */
    run: function(ex, mode) {
        ex = ex || this.createException();
        // examine exception properties w/o debugger
        //for (var prop in ex) {alert("Ex['" + prop + "']=" + ex[prop]);}
        mode = mode || this.mode(ex);
        if (mode === 'other') {
            return this.other(arguments.callee);
        } else {
            return this[mode](ex);
        }
    },

    createException: function() {
        try {
            this.undef();
        } catch (e) {
            return e;
        }
    },

    /**
     * Mode could differ for different exception, e.g.
     * exceptions in Chrome may or may not have arguments or stack.
     *
     * @return {String} mode of operation for the exception
     */
    mode: function(e) {
        if (e['arguments'] && e.stack) {
            return 'chrome';
        } else if (typeof e.message === 'string' && typeof window !== 'undefined' && window.opera) {
            // e.message.indexOf("Backtrace:") > -1 -> opera
            // !e.stacktrace -> opera
            if (!e.stacktrace) {
                return 'opera9'; // use e.message
            }
            // 'opera#sourceloc' in e -> opera9, opera10a
            if (e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
                return 'opera9'; // use e.message
            }
            // e.stacktrace && !e.stack -> opera10a
            if (!e.stack) {
                return 'opera10a'; // use e.stacktrace
            }
            // e.stacktrace && e.stack -> opera10b
            if (e.stacktrace.indexOf("called from line") < 0) {
                return 'opera10b'; // use e.stacktrace, format differs from 'opera10a'
            }
            // e.stacktrace && e.stack -> opera11
            return 'opera11'; // use e.stacktrace, format differs from 'opera10a', 'opera10b'
        } else if (e.stack) {
            return 'firefox';
        }
        return 'other';
    },

    /**
     * Given a context, function name, and callback function, overwrite it so that it calls
     * printStackTrace() first with a callback and then runs the rest of the body.
     *
     * @param {Object} context of execution (e.g. window)
     * @param {String} functionName to instrument
     * @param {Function} function to call with a stack trace on invocation
     */
    instrumentFunction: function(context, functionName, callback) {
        context = context || window;
        var original = context[functionName];
        context[functionName] = function instrumented() {
            callback.call(this, printStackTrace().slice(4));
            return context[functionName]._instrumented.apply(this, arguments);
        };
        context[functionName]._instrumented = original;
    },

    /**
     * Given a context and function name of a function that has been
     * instrumented, revert the function to it's original (non-instrumented)
     * state.
     *
     * @param {Object} context of execution (e.g. window)
     * @param {String} functionName to de-instrument
     */
    deinstrumentFunction: function(context, functionName) {
        if (context[functionName].constructor === Function &&
                context[functionName]._instrumented &&
                context[functionName]._instrumented.constructor === Function) {
            context[functionName] = context[functionName]._instrumented;
        }
    },

    /**
     * Given an Error object, return a formatted Array based on Chrome's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    chrome: function(e) {
        var stack = (e.stack + '\n').replace(/^\S[^\(]+?[\n$]/gm, '').
          replace(/^\s+at\s+/gm, '').
          replace(/^([^\(]+?)([\n$])/gm, '{anonymous}()@$1$2').
          replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}()@$1').split('\n');
        stack.pop();
        return stack;
    },

    /**
     * Given an Error object, return a formatted Array based on Firefox's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    firefox: function(e) {
        return e.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
    },

    opera11: function(e) {
        // "Error thrown at line 42, column 12 in <anonymous function>() in file://localhost/G:/js/stacktrace.js:\n"
        // "Error thrown at line 42, column 12 in <anonymous function: createException>() in file://localhost/G:/js/stacktrace.js:\n"
        // "called from line 7, column 4 in bar(n) in file://localhost/G:/js/test/functional/testcase1.html:\n"
        // "called from line 15, column 3 in file://localhost/G:/js/test/functional/testcase1.html:\n"
        var ANON = '{anonymous}', lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;
        var lines = e.stacktrace.split('\n'), result = [];

        for (var i = 0, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var location = match[4] + ':' + match[1] + ':' + match[2];
                var fnName = match[3] || "global code";
                fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON);
                result.push(fnName + '@' + location + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
            }
        }

        return result;
    },

    opera10b: function(e) {
        // "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
        // "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
        // "@file://localhost/G:/js/test/functional/testcase1.html:15"
        var ANON = '{anonymous}', lineRE = /^(.*)@(.+):(\d+)$/;
        var lines = e.stacktrace.split('\n'), result = [];

        for (var i = 0, len = lines.length; i < len; i++) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var fnName = match[1]? (match[1] + '()') : "global code";
                result.push(fnName + '@' + match[2] + ':' + match[3]);
            }
        }

        return result;
    },

    /**
     * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    opera10a: function(e) {
        // "  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n"
        // "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n"
        var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
        var lines = e.stacktrace.split('\n'), result = [];

        for (var i = 0, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var fnName = match[3] || ANON;
                result.push(fnName + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
            }
        }

        return result;
    },

    // Opera 7.x-9.2x only!
    opera9: function(e) {
        // "  Line 43 of linked script file://localhost/G:/js/stacktrace.js\n"
        // "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n"
        var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
        var lines = e.message.split('\n'), result = [];

        for (var i = 2, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                result.push(ANON + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
            }
        }

        return result;
    },

    // Safari, IE, and others
    other: function(curr) {
        var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i, stack = [], fn, args, maxStackSize = 10;
        while (curr && stack.length < maxStackSize) {
            fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
            args = Array.prototype.slice.call(curr['arguments'] || []);
            stack[stack.length] = fn + '(' + this.stringifyArguments(args) + ')';
            curr = curr.caller;
        }
        return stack;
    },

    /**
     * Given arguments array as a String, subsituting type names for non-string types.
     *
     * @param {Arguments} object
     * @return {Array} of Strings with stringified arguments
     */
    stringifyArguments: function(args) {
        var result = [];
        var slice = Array.prototype.slice;
        for (var i = 0; i < args.length; ++i) {
            var arg = args[i];
            if (arg === undefined) {
                result[i] = 'undefined';
            } else if (arg === null) {
                result[i] = 'null';
            } else if (arg.constructor) {
                if (arg.constructor === Array) {
                    if (arg.length < 3) {
                        result[i] = '[' + this.stringifyArguments(arg) + ']';
                    } else {
                        result[i] = '[' + this.stringifyArguments(slice.call(arg, 0, 1)) + '...' + this.stringifyArguments(slice.call(arg, -1)) + ']';
                    }
                } else if (arg.constructor === Object) {
                    result[i] = '#object';
                } else if (arg.constructor === Function) {
                    result[i] = '#function';
                } else if (arg.constructor === String) {
                    result[i] = '"' + arg + '"';
                } else if (arg.constructor === Number) {
                    result[i] = arg;
                }
            }
        }
        return result.join(',');
    },

    sourceCache: {},

    /**
     * @return the text from a given URL
     */
    ajax: function(url) {
        var req = this.createXMLHTTPObject();
        if (req) {
            try {
                req.open('GET', url, false);
                req.send(null);
                return req.responseText;
            } catch (e) {
            }
        }
        return '';
    },

    /**
     * Try XHR methods in order and store XHR factory.
     *
     * @return <Function> XHR function or equivalent
     */
    createXMLHTTPObject: function() {
        var xmlhttp, XMLHttpFactories = [
            function() {
                return new XMLHttpRequest();
            }, function() {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function() {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }, function() {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ];
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
                // Use memoization to cache the factory
                this.createXMLHTTPObject = XMLHttpFactories[i];
                return xmlhttp;
            } catch (e) {
            }
        }
    },

    /**
     * Given a URL, check if it is in the same domain (so we can get the source
     * via Ajax).
     *
     * @param url <String> source url
     * @return False if we need a cross-domain request
     */
    isSameDomain: function(url) {
        return url.indexOf(location.hostname) !== -1;
    },

    /**
     * Get source code from given URL if in the same domain.
     *
     * @param url <String> JS source URL
     * @return <Array> Array of source code lines
     */
    getSource: function(url) {
        // TODO reuse source from script tags?
        if (!(url in this.sourceCache)) {
            this.sourceCache[url] = this.ajax(url).split('\n');
        }
        return this.sourceCache[url];
    },

    guessAnonymousFunctions: function(stack) {
        for (var i = 0; i < stack.length; ++i) {
            var reStack = /\{anonymous\}\(.*\)@(.*)/,
                reRef = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,
                frame = stack[i], ref = reStack.exec(frame);

            if (ref) {
                var m = reRef.exec(ref[1]), file = m[1],
                    lineno = m[2], charno = m[3] || 0;
                if (file && this.isSameDomain(file) && lineno) {
                    var functionName = this.guessAnonymousFunction(file, lineno, charno);
                    stack[i] = frame.replace('{anonymous}', functionName);
                }
            }
        }
        return stack;
    },

    guessAnonymousFunction: function(url, lineNo, charNo) {
        var ret;
        try {
            ret = this.findFunctionName(this.getSource(url), lineNo);
        } catch (e) {
            ret = 'getSource failed with url: ' + url + ', exception: ' + e.toString();
            ret = "function unknown";
        }
        return ret;
    },

    findFunctionName: function(source, lineNo) {
        // FIXME findFunctionName fails for compressed source
        // (more than one function on the same line)
        // TODO use captured args
        // function {name}({args}) m[1]=name m[2]=args
        var reFunctionDeclaration = /function\s+([^(]*?)\s*\(([^)]*)\)/;
        // {name} = function ({args}) TODO args capture
        // /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function(?:[^(]*)/
        var reFunctionExpression = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function\b/;
        // {name} = eval()
        var reFunctionEvaluation = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(?:eval|new Function)\b/;
        // Walk backwards in the source lines until we find
        // the line which matches one of the patterns above
        var code = "", line, maxLines = Math.min(lineNo, 20), m, commentPos;
        for (var i = 0; i < maxLines; ++i) {
            // lineNo is 1-based, source[] is 0-based
            line = source[lineNo - i - 1];
            commentPos = line.indexOf('//');
            if (commentPos >= 0) {
                line = line.substr(0, commentPos);
            }
            // TODO check other types of comments? Commented code may lead to false positive
            if (line) {
                code = line + code;
                m = reFunctionExpression.exec(code);
                if (m && m[1]) {
                    return m[1];
                }
                m = reFunctionDeclaration.exec(code);
                if (m && m[1]) {
                    //return m[1] + "(" + (m[2] || "") + ")";
                    return m[1];
                }
                m = reFunctionEvaluation.exec(code);
                if (m && m[1]) {
                    return m[1];
                }
            }
        }
        return '(?)';
    }
};

};

/* ~ */

var duu = duu ? duu : {};

duu.alert = (typeof duu.alert !== 'undefined') ? duu.alert : true;

duu.assert = duu.assert ? duu.assert : function (statement, message, priority, valueN)
{
	if (!statement) {
		//if (priority >= 0)
		{
			//duu.trace();
			try {
				message = JSON.stringify(message);
			}
			catch (e)
			{
			}
			message = message && message.toString ? message.toString() : message;
			
			duu.expose = Array.prototype.slice.call(arguments, 3);
			
			if (duu.alert)
			{
				var implementation = (function () {
					var showTrace = confirm("ASSERTION FAILED! " + message);
					
					if (showTrace)
					{
						var cache = duu.debug;
						duu.debug = true;
						if (duu.trace instanceof Function)
						{
							duu.trace();
						}
						duu.debug = cache;
						
						var backtrace = (duu.printStackTrace instanceof Function) ? duu.printStackTrace.call(null) : "stacktrace unavailable!";
						
						confirm("ASSERT: " + backtrace);
					}
				});
				
				if (duu.native === true)
				{
					setTimeout(implementation, 0);
				}
				else
				{
					implementation();
				}
			}
			
			return false;
		}
		
		return false;
	}
	
	return true;
};

// native should have a channel of its own -- complete with requestCode mapping
duu.chan = (function () {
	
	var iframe = null;
	
	var nativeChannelId = null;
	
	var limitCode = 2000000000;
	var initialCode = 1;
	
	var requestCode = initialCode;
	
	var requestQueue = [];
	
	var responderRegistry = {};
	
	var serviceRegistry = {};
	
	var recastRegistry = {};
	
	var syncBatchers = {};
	
	var slice = Array.prototype.slice;
	
	var isString = function (val) {
		return (val instanceof String) || typeof val === "string";
	};
	
	var isNumber = function (val) {
		return (val instanceof Number) || typeof val === "number";
	};
	
	var prepareResponder = function (code, responder) {
		
		if (!isNumber(code) &&
			!isString(code))
		{
			duu.assert(false, "duu.chan::prepareResponder(): invalid code", 0, code);
			return false;
		}
		
		if (!(responder instanceof Object))
		{
			duu.assert(false, "duu.chan::prepareResponder(): invalid responder", 0, responder);
			return false;
		}
		
		if (responderRegistry[code] != null &&
			responderRegistry[code] != responder)
		{
			duu.assert(false, "duu.chan::prepareResponder(): responder collision (code, existing, proposed)", 0, code, responderRegistry[code], responder);
			return false;
		}
		
		responderRegistry[code] = responder;
		
		return true;
	};
	
	var retrieveResponder = function (code) {
		
		if (!isNumber(code) &&
			!isString(code))
		{
			duu.assert(false, "duu.chan::retrieveResponder(): invalid code", 0, code);
			return null;
		}
		
		return responderRegistry[code];
	};
	
	var cleanupResponder = function (code) {
		
		if (!isNumber(code) &&
			!isString(code))
		{
			duu.assert(false, "duu.chan::cleanupResponder(): invalid code", 0, code);
			return false;
		}
		
		delete responderRegistry[code];
		
		return true;
	};
	
	var openService = function (service, func) {
		
		if (!isString(service))
		{
			duu.assert(false, "duu.chan::openService(): invalid service", 0, service);
			return false;
		}
		
		if (!(func instanceof Function))
		{
			duu.assert(false, "duu.chan::openService(): invalid function", 0, func);
			return false;
		}
		
		if (serviceRegistry[service] != null &&
			serviceRegistry[service] != func)
		{
			duu.assert(false, "duu.chan::openService(): service collision (service, existing, proposed)", 0, service, serviceRegistry[service], func);
			return false;
		}
		
		serviceRegistry[service] = func;
		
		return true;
	};
	
	var getService = function (service) {
		
		if (!isString(service))
		{
			duu.assert(false, "duu.chan::getService(): invalid service", 0, service);
			return null;
		}
		
		return serviceRegistry[service];
	};
	
	var closeService = function (service) {
		
		if (!isString(service))
		{
			duu.assert(false, "duu.chan::closeService(): invalid service", 0, service);
			return false;
		}
		
		delete serviceRegistry[service];
		
		return true;
	};
	
	// inspite of its appearance, this function is not responsible for correctly molding stringy return values
	var prepareDataForChannel = function (data, channelId) {
		
		if (data == null)
		{
			data = null;
		}
		
		if (channelId != nativeChannelId)
		{
			if (!isString(data))
			{
				try
				{
					data = JSON.stringify(data);
				}
				catch (e)
				{
					duu.assert(false, "duu.chan::prepareDataForChannel(): data could not be serialized for sending to channel "+channelId, 0, data, channelId);
					data = null;
				}
			}
		}
		else if (data != null &&
				!(data instanceof Object))
		{
			duu.assert(false, "duu.chan::prepareDataForChannel(): invalid data for native channel", 0, data);
			data = null;
		}
		
		return data;
	};
	
	
	
	
	
	return new (function () {
		
		var support = (function () {
			var agent = navigator.userAgent.toLowerCase();
			
			var config = {};
			
			config["ios"] = agent.indexOf("ipod") > -1 ||
							agent.indexOf("iphone") > -1 ||
							agent.indexOf("ipad") > -1;
			config["android"] = agent.indexOf("android") > -1;
			config["windows"] = agent.indexOf("windows phone") > -1;
			config["pc"] = agent.indexOf("macintosh") > -1;
			config["unknown"] = true;
			
			return config;
		})();
		
		var platforms = [
			"ios",
			"android",
			"windows",
			"pc",
			"unknown",
		];
		
		this.recast = function (band, target) {
			
			if (!isString(band))
			{
				return false;
			}
			
			if (!target ||
				!(target.duuid instanceof Function) ||
				!(target.receive instanceof Function)) {
				
				duu.assert(false, "duu.chan::recast(): invalid target for recasting", 0, target);
				return false;
			}
			
			var targetRegistry = recastRegistry[band];
			
			if (!(targetRegistry instanceof Object)) {
				targetRegistry = recastRegistry[band] = {};
			}
			
			var duuid = target.duuid();
			var collision = targetRegistry[duuid];
			
			if (collision == target) {
				return true;
			}
			
			if (collision != null) {
				duu.assert(false, "duu.chan::recast(): collision on duuid "+duuid, 0, target, collision, duuid);
				return false;
			}
			
			targetRegistry[duuid] = target;
			
			return true;
		};
		
		this.receive = function (message) {
			this.connect(
				message.service, 
				message.data, 
				message.code, 
				message.clientId, 
				message.listeners
			);
			return true;
		};
		
		this.duuid = function () { return 0; };
		
		this.recast("*duunacl", this);
		
		var narrowcast = function (message, targets) {
			if (message == null) {
				return false;
			} else if (message instanceof Array) {
				var count = message.length;
				for (var i = 0; i < cound; i++) {
					narrowcast(message[i], targets);
				}
				return true;
			} else if (message instanceof Object) {
				for (var duuid in targets) {
					targets[duuid].receive(message);
				}
				return true;
			} else {
				return false;
			}
		};
		
		var broadcast = this.broadcast = function (message) {
			if (message == null) {
				return false;
			} else if (message instanceof Array) {
				var count = message.length;
				for (var i = 0; i < count; i++) {
					broadcast(message[i]);
				}
				return true;
			} else if (message instanceof Object) {
				for (var band in message) {
					var targetMap = recastRegistry[band];
					if (targetMap instanceof Object) {
						narrowcast(message[band], targetMap);
					}
				}
				return true;
			} else {
				return false;
			}
		};
		
		this.sync = function (batcher) {
			if (!batcher ||
				!(batcher.duuid instanceof Function) ||
				!(batcher.feed instanceof Function)) {
				
				duu.assert(false, "duu.chan::sync(): invalid batcher for syncing", 0, batcher);
				return false;
			}
			
			var duuid = batcher.duuid();
			var collision = syncBatchers[duuid];
			
			if (collision == batcher) {
				return true;
			}
			
			if (collision != null) {
				duu.assert(false, "duu.chan::sync(): collision on duuid "+duuid, 0, batcher, collision, duuid);
				return false;
			}
			
			syncBatchers[duuid] = batcher;
			
			return true;
		};
		
		var pending = false;
		
		var signalPrefix = "duu://flush";
		var signalRegExp = new RegExp("^"+signalPrefix+"\?");
		signalPrefix += "?";
		
		this.signal = function () {
			pending = false;
			var uri = signalPrefix;
			
			var count = platforms.length;
			
			for (var i = 0; i < count; i++)
			{
				var key = platforms[i];
				
				if (support[key])
				{
					uri += key;
					break;
				}
			}
			
			iframe.src = uri;
		};
		
		this.flag = function () {
			if (!iframe)
			{
				iframe = document.createElement("IFRAME");
				document.documentElement.appendChild(iframe);
			}
			
			if (!pending)
			{
				pending = true;
				
				setTimeout(this.signal, 0);
			}
		};
		
		var feed = function () {
			
			var result = [];
			
			if (requestQueue.length > 0) {
				result.push({"*duunacl":requestQueue});
				requestQueue = [];
			}
			
			for (var duuid in syncBatchers) {
				var queue = syncBatchers[duuid].feed();
				
				if (queue == null) {
					continue;
				} else if (queue instanceof Array) {
					if (queue.length > 0) {
						result.push.apply(result, queue);
					}
				} else if (queue instanceof Object) {
					result.push(queue);
				}
			}
			
			if (requestQueue.length > 0) {
				result.push({"*duunacl":requestQueue});
				requestQueue = [];
			}
			
			return result;
		};
		
		this.flush = function (data, code, clientId) {
			var result = prepareDataForChannel(feed(), nativeChannelId);
			
			return result;
		};
		
		this.route = function (data, code, clientId) {
			
			if (!(data instanceof Object))
			{
				return null;
			}
			
			var url = data.url;
			
			var result = {allow:true};
			
			if (!isString(url))
			{
				return null;
			}
			
			if (signalRegExp.test(url))
			{
				result.allow = false;
				result.consume = feed();
			}
			
			result = prepareDataForChannel(result, nativeChannelId);
			
			return result;
		};
		
		// this function is called directly by native -- return values must be stringy
		this.connect = function (service, data, code, clientId, listeners) {
			
			if (!isString(service))
			{
				return false;
			}
			
			var func = getService(service);
			
			if (!(func instanceof Function))
			{
				if (func != null)
				{
					duu.assert(false, "duu.chan::connect(): service registry polluted (service, function, registry)", 0, service, func, serviceRegistry);
				}
				
				return null; // dunno if this is stringy . . .  (hoping the result is "" or 0x0 -- as opposed to "true", "false", or "undefined");
			}
			
			var result = func(data, code, clientId, listeners);
			
			try {
				result = JSON.stringify(result);
				
				return result;
			}
			catch (e) {
				duu.assert(false, "duu.chan::connect(): malformed service result (service, function, result)", 0, service, func, result);
				
				return false;
			}
			
			return false;
		};
		
		// this function is called directly by native -- return values must be stringy
		this.respond = function (data, code, providerId) {
			var responder = retrieveResponder(code);
			
			if (!responder)
			{
				duu.assert(false, "duu.chan::respond(): expected responder but found none (data, code, providerId)", 0, data, code, providerId);
				return false;
			}
			
			if (data == null)
			{
				data = {};
			}
			
			var skipCleanup = false;
			
			if (responder.callback instanceof Function)
			{
				skipCleanup = responder.callback(data.err, data.result, responder.data, providerId);
			}
			
			if (skipCleanup !== true)
			{
				cleanupResponder(code);
			}
			
			return true;
		};
		
		this.request = function (service, data, callback, providerId, listenerIdN) {
			
			if (!isString(service))
			{
				duu.assert(false, "duu.chan::request(): invalid service", 0, service);
				return false;
			}
			
			var listeners = listenerIdN;
			
			if (listeners == null)
			{
				listeners = null;
			}
			else if (!(listeners instanceof Array))
			{
				listeners = slice.call(arguments, 4);
			}
			
			if (providerId == null)
			{
				// provider is native
				providerId = nativeChannelId;
			}
			else if (!isString(providerId) &&
					!isNumber(providerId))
			{
				duu.assert(false, "duu.chan::request(): invalid provider "+providerId+" defaulting to native", 0, providerId);
				providerId = nativeChannelId;
			}
			
			if (!(callback instanceof Function))
			{
				callback = null;
			}
			
			var code = requestCode++;
			
			if (requestCode > limitCode)
			{
				requestCode = initialCode;
			}
			
			var responder = {
				input: data,
				callback: callback,
			};
			
			if (!prepareResponder(code, responder))
			{
				duu.assert(false, "duu.chan::request(): responder preparation failed for code "+code, 0, code);
				return false;
			}
			
			data = prepareDataForChannel(data, providerId);
			
			var req = {
				service: service,
				data: data,
				provider: providerId,
				listeners: listeners,
				code: code,
			};
			
			requestQueue.push(req);
			
			this.flag();
			
			return true;
		};
		
		
		
		var serviceCheck = true;
		
		serviceCheck = openService("route", this.route);
		
		duu.assert(serviceCheck, "duu.chan(): failed to initialize 'route' service", 0, serviceRegistry);
		
		serviceCheck = openService("flush", this.flush);
		
		duu.assert(serviceCheck, "duu.chan(): failed to initialize 'flush' service", 0, serviceRegistry);
		
		serviceCheck = openService("respond", this.respond);
		
		duu.assert(serviceCheck, "duu.chan(): failed to initialize 'respond' service", 0, serviceRegistry);
		
		serviceCheck = openService("broadcast", this.broadcast);
		
		duu.assert(serviceCheck, "duu.chan(): failed to initialize 'broadcast' service", 0, serviceRegistry);
		
	});
})();

/* ~ */

duu.build_case( function (closingStatements)  {
	
	var grd = new duu.Guard();
	
	var queue = [];
	vs.queue  = queue; //debug
	
	vs.api = {};
	vs.api.request = function () {
		queue.push.apply(queue, arguments);
	};
	
	duu.App = function () {
		duu.mixin(duu.Base, this, grd);
		var priv = this.dpriv(grd);
		
		
		this.feed = function () {
			var result = queue || [];
			queue = [];
			vs.queue  = queue; //debug
			
			var request = {
			};
			
			request[vs.keytext.logger] = {
				"utc":vs.now()
			};
			
			result.push(request);
			
			return result;
		};
		
		duu.chan.sync(this);
	};
	
	new duu.App();
	
})();

(function () {
	
	var reg = new vs.Addresser.Registry();
	
	var dns = new vs.Addresser.DNS(reg);
	
	vs.lookup = vs.Addresser.gen({
		registry:reg,
		dns:dns,
		alias:null,
		init:null,
		term:null,
		digest:null,
		report:null,
	});
	
	var domain = null;
	
	var fabric = vs.Fabric.gen(vs.lookup, domain);
	
	fabric.setURI("CloseNormal.png");
	
	var scape = new vs.Scape.gen(vs.lookup, domain);
	
	scape.run();
	
	var zone = new vs.Zone.gen(vs.lookup, domain);
	
	scape.addLeaf(zone);
	
	var pixie = new vs.Pixie.gen(vs.lookup, domain);
	
	zone.addLeaf(pixie);
	
	pixie.setLoc(100, 100);
	
	pixie.setFabric(fabric);
	
})();

/* ~ */



/* ~ */



/* ~ */



/* ~ */



/* ~ */



/* ~ */

