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

/* ~ */

vs.args = function (collection) {
	return Array.prototype.slice.call(collection);
};

vs.bind = function (target, func) {
	return function () {
		func.apply(target, vs.args(arguments));
	};
};

/* ~ */

vs.clone = function (obj) {
	if (obj instanceof Array) {
		return obj.slice();
	} else if (obj instanceof Object) {
		var result = {};
		
		for (var k in obj) {
			result[k] = obj[k];
		}
		
		return result;
	} else {
		return null;
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
vs.keytext.task = vs.keytext.namespace + "";

vs.keytext.interface = vs.keytext.namespace + "$";
vs.keytext.logger = vs.keytext.namespace + "<<";
vs.keytext.addresser = vs.keytext.namespace + "@";
vs.keytext.domain = vs.keytext.namespace + ".";

/* ~ */
(function () {
	var guid = 0;
	
	vs.Unique = function () {
		var _uuid = null;
		
		if (!(this.hasOwnProperty("ouuid")) ||
			!(this.ouuid instanceof Function)) {
			
			this.ouuid = function () {
				return _uuid;
			};
			
			_uuid = ++guid;
		}
	};
	
	vs.Ruled = function (domain) {
		if (!(this.hasOwnProperty("odname")) ||
			!(this.odname instanceof Function)) {
			
			if (domain == null) {
				domain = null;
			}
			
			this.odname = function () {
				return domain;
			};
		}
	};
	
})();

(function () {
	vs.Guard = function () {
		vs.Unique.call(this);
	};
	
	vs.Property = function (guard, result) {
		result = result || {};
		this.getter = function (name, field, sideeffect) {
			vs.assert(name.substr(0, 3) == "get" || name.substr(0, 2) == "is", "getter name without 'get' or 'is' prefix ("+name+" -- probably a typo)");
			result[name] = function () {
				var pmems = this.opriv(guard);
				if (sideeffect instanceof Function) {
					sideeffect.call(this, pmems[field], name, field)
				}
				return pmems[field];
			};
			return this;
		};
		this.setter = function (name, field, sideeffect) {
			vs.assert(name.substr(0, 3) == "set", "setter name without 'set' prefix ("+name+" -- probably a typo)");
			result[name] = function (value) {
				var pmems = this.opriv(guard);
				var previous = pmems[field];
				pmems[field] = value;
				if (sideeffect instanceof Function) {
					sideeffect.call(this, pmems[field], previous, name, field)
				}
				return this;
			};
			return this;
		};
		this.result = function () {
			return result;
		};
	};
	
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
		var employ = function (guard) {
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
				if (gpost &&
					gpost[gkey] == null) {
					gpost[gkey] = guard;
					return (this.opriv(uber)[gkey] = {});
				}
			}
		};
		
		return function (parent, guard, pdefs, child, pfaces) {
			
			var params = vs.args(arguments).slice(2);
			
			if (params[0] instanceof Function) {
				pdefs = null;
				child = params.shift();
				pfaces = params.shift();
			} else if (params[1] instanceof Function) {
				pdefs = params.shift();
				child = params.shift();
				pfaces = params.shift();
			} else if (params[1] instanceof Object) {
				pdefs = params.shift();
				child = null;
				pfaces = params.shift();
			} else {
				pdefs = null;
				child = null;
				pfaces = params.shift();
			}
			
			if (guard instanceof Array) {
				params = guard;
				guard = params.shift();
			} else {
				params = [];
			}
			
			var result = function () {
				var _priv = employ.call(this, guard);
				
				vs.iface(_priv, pdefs);
				
				if (child instanceof Function) {
					child.apply(this, vs.args(arguments));
				}
			};
			
			result.implementation = child;
			
			if (parent instanceof Function) {
				var helper = function (vars) {
					parent.apply(this, vars);
				};
				helper.prototype = parent.prototype;
				result.prototype = new helper(params);
			}
			
			var _pface = employ.call(result.prototype, guard);
			
			result.adapt = function () {
				var args = vs.args(arguments);
				args.unshift(this);
				return vs.adapt.apply(this, args);
			};
			
			vs.iface(_pface, pfaces);
			
			return result;
		}
	})();
	
	var dog = new vs.Guard();
	var uber = new vs.Guard();
	var token = new vs.Guard();
	var secret = new vs.Guard();
	
	vs.Target = vs.adapt(null, new vs.Guard());
})();

(function () {
	var guard = new vs.Guard();
	
	vs.Model = vs.Target.adapt(guard);
})();

(function () {
	var guard = new vs.Guard();
	
	vs.Entity = vs.Model.adapt(guard, function (domain) {
		vs.Unique.call(this);
		vs.Ruled.call(this, domain);
	});
	
	var properties = (new vs.Property(guard,
	{
		task:function (tag, result, nodispatch) {
			result = result || {};
			result[vs.keytext.task] = tag;
			result[vs.keytext.uuid] = this.ouuid();
			// add domain if available
			if (this.odname()) {
				result[vs.keytext.domain] = this.odname();
			}
			if (nodispatch !== true) {
				// send task to bridge
				if (vs.api &&
					(vs.api.request instanceof Function)) {
					var request = {};
					request[vs.keytext.addresser] = result;
					vs.api.request(request);
				}
			}
			return result;
		}
	}))
	.result();
	
	vs.iface(vs.Entity.prototype, properties);
})();

/* ~ */

(function () {
	var guard = new vs.Guard();
	
	var piface = null;
	
	vs.Fabric = vs.Entity.adapt(guard, {
		_uri:null,
		_width:NaN,
		_height:NaN,
		_dirty:true,
	},
	function (domain, filepath, notask) {
		vs.Entity.call(this, domain);
		
		var pmems = this.opriv(guard);
		pmems._uri = filepath || "";
		
		if (notask !== true) { // typically true when an adaptation prototype
			this.task("Fabric", {
				uri:pmems._uri,
				//width:pmems._width,
				//height:pmems._height,
			}, vs.bind(this, piface.clean));
		}
	},
	(new vs.Property(guard,
	{
		clean:function (config) {
			var pmems = this.opriv(guard);
			pmems._width = config.width;
			pmems._height = config.height;
			pmems._dirty = false;
		},
	}))
	.result()
	);
	
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
		_branch:null,
		_leaves:null,
		_ele:0,
		_code:null,
		_root:null,
		_loc:null,
		_magn:null,
		_ori:0,
	},
	function (domain, notask) {
		vs.Entity.call(this, domain);
		
		var pmems = this.opriv(guard);
		pmems._root = vs.geom.p(0, 0);
		pmems._loc = vs.geom.p(0, 0);
		pmems._magn = vs.geom.p(1, 1);
		
		if (notask !== true) { // typically true when an adaptation prototype
			this.task("Nexus", {
				root:pmems._root,
				loc:pmems._loc,
				magn:pmems._magn,
				ele:pmems._ele,
				ori:pmems._ori,
				code:pmems._code,
			});
		}
	},
	(new vs.Property(guard,
	{
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
	.result()
	);
	
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
	
	vs.Pixie = vs.Nexus.adapt([guard, false, true], {
		_box:null,
		_pigment:null,
		_density:1,
		_mirrorX:false,
		_mirrorY:false,
		_fabric:null,
	},
	function (domain, fabric, box, notask) {
		vs.Nexus.call(this, domain, true);
		
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
		
		if (notask !== true) { // typically true when an adaptation prototype
			var task = {
				box:pmems._box,
				pigment:pmems._pigment,
				density:pmems._density,
				root:this.getRoot(),
				loc:this.getLoc(),
				magn:this.getMagn(),
				ele:this.getEle(),
				ori:this.getOri(),
				code:this.getCode(),
			};
			
			if (pmems._fabric instanceof vs.Fabric) {
				task["fabricId"] = pmems._fabric.ouuid();
				
				if (pmems._fabric.odname()) {
					result["fabricDn"] = pmems._fabric.odname();
				}
			}
			
			this.task("Pixie", task);
		}
	}
	);
	
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
			return vs.geom.rect.cp(pmems._box);
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
	
	vs.Surface = vs.Nexus.adapt([guard, false, true], {
	},
	function (domain, fabric, box, notask) {
		vs.Nexus.call(this, domain, true);
		
		var pmems = this.opriv(guard);
		
		if (notask !== true) { // typically true when an adaptation prototype
			var task = {
				root:this.getRoot(),
				loc:this.getLoc(),
				magn:this.getMagn(),
				ele:this.getEle(),
				ori:this.getOri(),
				code:this.getCode(),
			};
			
			this.task("Surface", task);
		}
	}
	);
	
	piface = vs.papi(guard, vs.Surface);
	
	var properties = (new vs.Property(guard, {
		run:function () {
			this.task("run", {
			});
		},
	}))
	.result();
	
	vs.iface(vs.Surface.prototype, properties);
})();

/* ~ */

(function () {
	var guard = new vs.Guard();
	
	var piface = null;
	
	vs.Field = vs.Nexus.adapt([guard, false, true], {
	},
	function (domain, fabric, box, notask) {
		vs.Nexus.call(this, domain, true);
		
		var pmems = this.opriv(guard);
		
		if (notask !== true) { // typically true when an adaptation prototype
			var task = {
				root:this.getRoot(),
				loc:this.getLoc(),
				magn:this.getMagn(),
				ele:this.getEle(),
				ori:this.getOri(),
				code:this.getCode(),
			};
			
			this.task("Field", task);
		}
	}
	);
	
	piface = vs.papi(guard, vs.Field);
	
	var properties = (new vs.Property(guard))
	.result();
	
	vs.iface(vs.Field.prototype, properties);
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
	var fabric = new vs.Fabric();
	
	fabric.setURI("CloseNormal.png");
	
	var surface = new vs.Surface();
	
	surface.run();
	
	var field = new vs.Field();
	
	surface.addLeaf(field);
	
	var pixie = new vs.Pixie();
	
	field.addLeaf(pixie);
	
	pixie.setLoc(100, 100);
	
	pixie.setFabric(fabric);
	
})();

/* ~ */



/* ~ */



/* ~ */



/* ~ */



/* ~ */



/* ~ */

