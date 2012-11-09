/* build.sh generated */


/* ~ */


var vs = vs || {debug:true};

vs.assert = function (test, msg) {
	if (!test) {
		vs.assert.args = arguments;
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


vs.round = function (num, precision) {
	precision = precision || 0;
	precision = Math.pow(10, precision);
	return Math.round(num * precision) / precision;
}; 

/* ~ */


vs.now = function () {
	return Date.now();
};

vs.delay = function (func, time) {
	if (func instanceof Function) {
		time = time || 0;
		return setTimeout(func, time);
	}
};

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


vs.keytext = {};

vs.keytext.namespace = "";
vs.keytext.bldn = vs.keytext.namespace + "."; // bottom level domain name
vs.keytext.port = vs.keytext.namespace + ":";
vs.keytext.task = vs.keytext.namespace + "()";
vs.keytext.args = vs.keytext.namespace + "..."; //",";


vs.keytext.superior = vs.keytext.namespace + "$";
vs.keytext.assembler = "&";
vs.keytext.gate = "#";
vs.keytext.logger = vs.keytext.namespace + "<<";
vs.keytext.router = vs.keytext.namespace + "@";


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
		
		vs.validBottomLevelDomain = function (domain) {
			if (domain == null) {
				domain = null;
			}
			return domain;
		};
		
		var CommonRuled = Uniqueness(null);
		
		vs.Ruled = function (lookup, domain) {
			
			domain = vs.validBottomLevelDomain(domain);
			
			if (lookup == null) {
				lookup = null;
				domain = heisenberg;
			} else {
				vs.assert((lookup instanceof vs.Router), "ruler must be a valid router (or none at all)", lookup, this);
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
				
				this.opriv = (function (target) {
					var _priv = {};
					var _post = {};
					
					if (vs.debug === true) {
						target._priv = _priv;
						target._post = _post;
					}
					
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
				})(this);
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
		onnew:function (lookup, bldn) {
			vs.Ruled.call(this, lookup, bldn);
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
			result[vs.keytext.port] = this.ouuid();
			// add bottom level domain name if available
			if (this.odname()) {
				result[vs.keytext.bldn] = this.odname();
			}
			// send task to bridge
			var lookup = this.oruler();
			if (lookup) {
				lookup.produce(result);
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

var guard = guard || new vs.Guard();

(function () {
	
	var piface = null;
	
	vs.Worker = vs.Target.adapt(guard, {
		pdefs:{
			_alias:null,
			_digest:null,
			_superior:null,
		},
		pfaces:(new vs.Property(guard, {
		}))
		.result(),
		onnew:function (config) {
			
			config = config || {};
			
			vs.kvproof(
				config,
				"alias", "anon",
				"digest", null
			);
			
			var pmems = this.opriv(guard);
			pmems._alias = config.alias;
			pmems._digest = config.digest;
		},
		ongen:null,
	});
	
	piface = vs.papi(guard, vs.Worker);
	
	var properties = (new vs.Property(guard, {
		term:function () {
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
					if (json[i] instanceof Object) {
						result = pmems._digest.call(this, json[i]) && result;
					}
				}
			} else if (json instanceof Object) {
				result = pmems._digest.call(this, json) && result;
			}
			
			return result;
		},
		produce:function (json, purify) {
			var pmems = this.opriv(guard);
			
			if (pmems._superior) {
				
				var product = this.mark(json, purify);
				
				pmems._superior.produce(product, false);
				
				return true;
			}
			
			return false;
		},
		mark:function (json, purify) {
			var pmems = this.opriv(guard);
			
			if (!pmems._superior) {
				// no superior, no need to identify who produced the report(?)
				return json;
			}
			
			var result = {};
			result[pmems._alias] = json;
			
			return result;
		},
		report:function () {
		},
	}))
	.getter("getAlias", "_alias")
	.getter("getSuperior", "_superior")
	.result();
	
	vs.iface(vs.Worker.prototype, properties);
})();

(function () {
	
	var piface = null;
	
	vs.Superior = vs.Worker.adapt(guard, {
		alias:null,
		digest:null,
	},
	{
		pdefs:{
			_hires:null,
			_assistant:null,
		},
		pfaces:(new vs.Property(guard, {
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
				"digest", piface.impDigest
			);
			
			vs.Worker.call(this, config);
			
			var pmems = this.opriv(guard);
			pmems._hires = {};
		},
		ongen:null,
	});
	
	piface = vs.papi(guard, vs.Superior);
	
	var properties = (new vs.Property(guard, {
		term:function () {
			var pmems = this.opriv(guard);
			
			var args = vs.args(arguments);
			
			var keys = vs.keys(pmems._hires);
			var count = keys.length;
			
			// copy the keys because loseWorker may modify pmems._hires (unnecessary safety?)
			for (var i = 0; i < count; i++) {
				var alias = keys[i]
				var worker = this.loseWorker(alias);
				
				worker.term.apply(worker, args);
			}
			
			vs.assert(!pmems._assistant, "leaking on superiors assistant", pmems._assistant, this);
			
			return true;
		},
		gainWorker:function (worker) {
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
			//worker.init.apply(worker, vs.args(arguments, 1));
			
			return true;
		},
		loseWorker:function (alias) {
			// invoker is responsible for calling term() as is appropriate
			var pmems = this.opriv(guard);
			
			var worker = pmems._hires[alias];
			
			if (!worker) {
				return null;
			}
			
			var omems = worker.opriv(guard);
			if (omems._superior === this) {
				omems._superior = null;
			} else {
				vs.assert(0, "worker has an superior that is not this object: "+omems._superior.alias, this, worker, omems._superior);
			}
			
			if (pmems._assistant === worker) {
				pmems._assistant = null;
			}
			
			delete pmems._hires[alias];
			
			// invoker is responsible for calling term() as is appropriate
			return worker;
		},
		assignAssistant:function (helper) {
			var pmems = this.opriv(guard);
			if (pmems._assistant) {
				if (pmems._assistant === helper) {
					return true;
				}
				vs.assert(0, "this superior already has an assistant", helper, pmems._assistant, this);
				return false;
			}
			
			if (helper == null) {
				pmems._assistant = null;
				return true;
			} else if (this.gainWorker(helper)) {
				pmems._assistant = helper;
				return true;
			}
			
			vs.assert(0, "failed to hire assistant", helper, pmems._hires, this);
			return false;
		},
		escalate:function (json, purify) {
			var superior = this.getSuperior();
			if (superior &&
				this === superior.getProductHelper()) {
				
				var product = this.mark(json, purify);
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
			return vs.Worker.prototype.report.call(this);
		},
		report:function (json, purify) {
			var pmems = this.opriv(guard);
			var helper = pmems._assistant;
			
			if (!helper) {
				return this.brief();
			}
			
			return helper.report();
		},
		getHires:function () {
			var pmems = this.opriv(guard);
			return vs.clone(pmems._hires);
		},
	}))
	.getter("getAssistant", "_assistant")
	.result();
	
	vs.iface(vs.Superior.prototype, properties);
})();

})();


/* ~ */


(function () {
	
	var guard = guard || new vs.Guard();
	
	var piface = null;
	
	vs.Integrator = vs.Worker.adapt(guard, {
		alias:null,
		digest:null,
	},
	{
		pdefs:{
		},
		pfaces:(new vs.Property(guard, {
			impDigest:function (json) {
				return false;
			}
		}))
		.result(),
		onnew:function (config) {
			
			config = config || {};
			
			vs.kvproof(
				config,
				"alias", vs.keytext.assembler,
				"digest", piface.impDigest
			);
			
			vs.Worker.call(this, config);
		},
		ongen:null,
	});
	
	piface = vs.papi(guard, vs.Integrator);
	
	var properties = (new vs.Property(guard, {
		produce:function (json, purify) {
			var superior = this.getSuperior();
			return superior.escalate(json, purify);
		},
		report:function (json, purify) {
			var superior = this.getSuperior();
			var coworkers = superiors.getHires();
			
			var result = [];
			
			for (var alias in coworkers) {
				var worker = coworkers[alias];
				
				if (this === worker) {
					continue;
				}
				
				var issue = worker.report();
				
				if (issue instanceof Array) {
					var count = issue.length;
					for (var i = 0; i < count; i++) {
						result.push(issue[i]);
					}
				} else if (issue instanceof Object) {
					result.push();
				}
			}
			
			return superior.mark(result, false);
		},
	}))
	.result();
	
	vs.iface(vs.Integrator.prototype, properties);
})();



/* ~ */


(function () {
	
	var guard = guard || new vs.Guard();
	
	var piface = null;
	
	vs.Gate = vs.Worker.adapt(guard, {
		alias:null,
		digest:null,
	},
	{
		pdefs:{
			_mainQueue:null,
			_offQueue:null,
			_time:null,
		},
		pfaces:(new vs.Property(guard, {
			impDigest:function (json) {
				var pmems = this.opriv(guard);
				
				if (json.opentime == null) {
					return;
				}
				
				if (pmems._time != null &&
					pmems._time >= json.opentime) {
					return;
				}
				
				pmems._time = json.opentime;
				
				var temp = null;
				
				// indicate flush fulfillment to requester
				this.produce(this.mark.apply(this, arguments));
				
				//vs.assert(
				//	pmems._offQueue.length <= 0, 
				//	"unexpected (but not catastrophic) gate flush request when off queue is not empty (investigate why)", 
				//	pmems._offQueue, 
				//	this
				//);
				// clear what will become the main queue
				if (pmems._offQueue.length > 0) {
					piface.clear.call(this);
				}
				
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
				"digest", piface.impDigest
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
		term:function () {
			var pmems = this.opriv(guard);
			pmems._mainQueue.splice(0, pmems._mainQueue.length);
			pmems._offQueue.splice(0, pmems._offQueue.length);
		},
		produce:function (json, purify) {
			var pmems = this.opriv(guard);
			
			if (purify) {
				json = vs.clone(json);
			}
			
			pmems._mainQueue.push(json);
			
			return true;
		},
		report:function (json, purify) {
			var superior = this.getSuperior();
			// matters were reported, no longer responsible
			return superior.mark(piface.clear.call(this), false);
		},
	}))
	.result();
	
	vs.iface(vs.Gate.prototype, properties);
})();



/* ~ */


(function () {

(function () {
	
	var guard = guard || new vs.Guard();
	
	var piface = null;
	
	vs.Router = vs.Worker.adapt(guard, {
		alias:null,
		digest:null
	},
	{
		pdefs:{
			_table:null,
			_bdns:null,
		},
		pfaces:(new vs.Property(guard, {
			impDigest:function (json) {
				var pmems = this.opriv(guard);
				
				var port = json[vs.keytext.port];
				var bldn = json[vs.keytext.bldn];
				var task = json[vs.keytext.task];
				
				var entity = pmems._table.whois(bldn, port);
				
				if (!entity) {
					vs.assert(0, "message unexpectedly sent to unassigned register ."+bldn+":"+port);
					return false;
				}
				
				return entity.enact(json, pmems._bdns);
			},
		}))
		.result(),
		onnew:function (config) {
			
			config = config || {};
			
			vs.assert((config.bdns instanceof vs.Router.BDNS), "router needs a valid bdns: "+config.bdns, config.bdns, config, this);
			vs.assert((config.table instanceof vs.Router.Table), "router needs a valid table: "+config.table, config.table, config, this);
			
			vs.kvproof(
				config,
				"alias", vs.keytext.router,
				"digest", piface.impDigest
			);
			
			vs.Worker.call(this, config);
			
			var pmems = this.opriv(guard);
			pmems._table = config.table;
			pmems._bdns = config.bdns;
		},
		ongen:null,
	});
	
	piface = vs.papi(guard, vs.Router);
	
	var properties = (new vs.Property(guard, {
		term:function () {
			var pmems = this.opriv(guard);
			delete pmems._table;
			delete pmems._bdns;
			pmems._table = null;
			pmems._bdns = null;
			return true;
		},
	}))
	.result();
	
	vs.iface(vs.Router.prototype, properties);
})();

(function () {

	vs.Router.BDNS = function (t) {
		
		vs.assert((t instanceof vs.Router.Table), "bdns needs a valid table", t, this);
		
		var _table = t;
		
		this.whois = function () {
			return _table.whois.apply(_table, arguments);
		};
	}
	
	vs.Router.Table = function () {
		var _records = {};
		
		var safeListing = function (bldn) {
			bldn = vs.validBottomLevelDomain(bldn);
			
			return _records[bldn] = _records[bldn] || {};
		};
		
		this.whois = function (bldn, port) {
			var listing = safeListing(bldn);
			
			return listing[port];
		};
		
		this.assign = function (owner, bldn, port) {
			if (owner == null) {
				vs.assert(0, "no valid owner provided for assignment (requests to clear records should invoke revoke() instead)");
				return false;
			} else if (!(owner instanceof vs.Entity)) {
				vs.assert(0, "only valid entities may be assigned", owner);
				return false;
			}
			
			var listing = safeListing(bldn);
			
			if (vs.defined(listing[port])) {
				if (listing[port] === owner) {
					return true;
				}
				vs.assert(0, "register ."+bldn+":"+port+" is already assigned", listing[port], port, bldn, owner);
				return false;
			}
			
			listing[port] = owner;
			
			return true;
		};
		
		this.revoke = function (owner, bldn, port) {
			var listing = safeListing(bldn);
			
			if (!vs.defined(listing[port])) {
				vs.assert(0, "register ."+bldn+":"+port+" is not assigned", listing, port, bldn, owner);
				return false;
			} else if (listing[port] !== owner) {
				vs.assert(0, "register ."+bldn+":"+port+" is not assigned to the suggested owner", listing[port], port, bldn, owner);
				return false;
			}
			
			delete listing[port];
			
			return true;
		};
	};
	
})();

})();


/* ~ */


(function () {
	vs.API = function () {
	};
	
	vs.API.prototype.handle = function (message) {};
	vs.API.prototype.flush = function () {};
	
	vs.API.WorkerInterface = function (chief) {
		vs.assert((chief instanceof vs.Worker), "worker interface needs a valid worker", chief, this);
		var _boss = chief;
		
		this.handle = function (message) {
			
			var json = null;
			
			try {
				json = JSON.parse(message);
			} catch (e) {}
			
			_boss.consume(json);
		};
		
		this.flush = function () {
			
			var json = null;
			
			try {
				json = JSON.stringify(_boss.report(json, false));
			} catch (e) {
				json = "null";
			}
			
			return json;
		};
	};
	
	vs.API.WorkerInterface.prototype = new vs.API();
	
	vs.Terminal = function (api, notify) {
		vs.assert((api instanceof vs.API), "terminal needs a valid interface", api, this);
		var _interface = api;
		var _mainQueue = [];
		var _offQueue = [];
		
		var _pending = false;
		
		var terminal = this;
		
		var _execute = function () {
			
			var temp;
			
			vs.assert(_offQueue.length == 0, "off queue was not emptied... requests are probably stacking up!");
			
			temp = _offQueue;
			_offQueue = _mainQueue;
			_mainQueue = temp;
			temp = _offQueue;
			
			_pending = false;
			
			var count = temp.length;
			
			temp = temp.splice(0, count);
			
			for (var i = 0; i < count; i++) {
				_interface.handle(temp[i]);
			}
			
			if (terminal.notify instanceof Function ) {
				terminal.notify();
			}
		};
		
		this.notify = notify;
		
		this.bridgeOutput = function (message) {
			if (vs.emptied(message)) {
				
				if (terminal.notify instanceof Function ) {
					terminal.notify();
				}
				return;
			}
			_mainQueue.push(message);
			if (!_pending) {
				_pending = true;
				// NOTE: has to return immediately!
				vs.delay(_execute);
			}
		};
		
		this.bridgeInput = function () {
			return _interface.flush();
		};
	};
})();



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
		onnew:function (lookup, bldn, filepath) {
			vs.Entity.call(this, lookup, bldn);
			
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
		onnew:function (lookup, bldn) {
			vs.Entity.call(this, lookup, bldn);
			
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
		onnew:function (lookup, bldn, fabric, box) {
			vs.Nexus.call(this, lookup, bldn);
			
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
	
	vs.Troop = vs.Nexus.adapt(guard, {
		pdefs:{
			_fabric:null,
		},
		pfaces:null,
		onnew:function (lookup, bldn, fabric, box) {
			vs.Nexus.call(this, lookup, bldn);
			
			var pmems = this.opriv(guard);
			pmems._fabric = fabric;
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
			
			var fabric = this.getFabric();
			
			if (fabric instanceof vs.Fabric) {
				task["fabricId"] = fabric.ouuid();
				
				if (pmems._fabric.odname()) {
					result["fabricDn"] = fabric.odname();
				}
			}
			
			this.task("Troop", task);
		},
	});
	
	piface = vs.papi(guard, vs.Troop);
	
	var properties = (new vs.Property(guard,
	{
	}))
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
	
	vs.iface(vs.Troop.prototype, properties);
})();


/* ~ */


(function () {
	var guard = new vs.Guard();
	
	var piface = null;
	
	vs.Scape = vs.Nexus.adapt(guard, {
		pdefs:null,
		pfaces:null,
		onnew:function (lookup, bldn) {
			vs.Nexus.call(this, lookup, bldn, true);
			
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
		onnew:function (lookup, bldn) {
			vs.Nexus.call(this, lookup, bldn);
			
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





/* ~ */



