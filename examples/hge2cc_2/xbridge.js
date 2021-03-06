var xbridge = xbridge || {};


(function ()  {
	
	var runit = null;
	
	xbridge.xbridge = function () {
		xbridge.instance = new (function () {
			
			var shouldTick = true;
			
			var module = document.createElement("EMBED");
			
			this.onmodule = vs.bind(this, function () {
				console.log("onmodule");
				runit();
				this.tick();
			});
			
			
			this.onmessage = vs.bind(this, function (event) {
				var message = event.data;
				try {
					var data = JSON.parse(message);
					message = null;
					hge.terminal.bridgeOutput(data);
				} catch (e) {
					if (message) {
						console.log("message: "+message);
						//console.log("exception: "+e.message);
					}
					return;
				}
				
				setTimeout(this.tock, 10);
			});
			
			//this.tock = vs.bind(this, function () {
			//	if (shouldTick) {
			//		shouldTick = false;
			//		this.tick();
			//	}
			//});
			
			this.tick = function () {
				var message = hge.terminal.bridgeInput();
				
				module.postMessage(message);
			};
			
			module.addEventListener('load', this.onmodule, true);
			module.addEventListener('message', this.onmessage, true);
			
			module.id = "xbridge.module";
			module.src = "xbridge.nmf";
			module.type = "application/x-nacl";
			module.width = 640;
			module.height = 960;
			module.width = 480;
			module.height = 320;
			
			module.div = document.createElement("DIV");
			module.div.id = "xbridge.div";
			module.div.appendChild(module);
			
			document.body.appendChild(module.div);
		});
	};
	
	runit = (function () {
	window.hge = window.hge || {};

var superior = new vs.Superior({
	alias:null,
	digest:null,
});

var gate = new vs.Gate({
	alias:null,
	digest:null,
	doubleBuffered:true,
});

var table = new vs.Router.Table();

var bdns = new vs.Router.BDNS(table);

var switchboard = new vs.Router.Switchboard(table);

var lookup = vs.Router.gen({
	table:table,
	bdns:bdns,
	alias:null,
	digest:null,
});

superior.assignAssistant(gate);

superior.gainWorker(lookup);

var api = new vs.API.WorkerInterface(superior, loop);

var synchronous = true;

hge.terminal = new vs.Terminal(api, synchronous);





var broadcast = function () {
	var t = vs.now();
	
	var taskKey = vs.keytext.task;
	var argsKey = vs.keytext.args;
	
	var job = {
		opentime:t
	};
	
	job[taskKey] = "flood";
	
	gate.consume(job); // open gate (will loop infinitely and unmitigated at present)
	xbridge.instance.tick();
};

var bldn = null;

var fabric = vs.Fabric.gen(lookup, bldn, null, switchboard);

fabric.setURI("CloseNormal.png");

var scape = new vs.Scape.gen(lookup, bldn, switchboard);

scape.run();

var zone = new vs.Zone.gen(lookup, bldn, inputHandler, switchboard);

scape.addLeaf(zone);

var troop = new vs.Troop.gen(lookup, bldn, null, switchboard);

troop.setFabric(fabric);

zone.addLeaf(troop);

var pixie = null;

var pixies = [];

for (var i = 0; i < 400; i++) {
	pixie = new vs.Pixie.gen(lookup, bldn, null, null, switchboard);
	
	var orbit = 100;
	pixie.myx = orbit + (Math.random() * orbit);
	pixie.myy = orbit + (Math.random() * orbit);
	pixie.myo = (orbit + Math.random() * orbit) / 2;
	pixie.myr = 300;
	pixie.mys = (1 + Math.random()) / 2;
	pixie.myw = (1 + Math.random()) / 200;
	
	pixie.setLoc(pixie.myx, pixie.myy);
	pixie.setFabric(fabric);
	//pixie.setMagn(0.0625, 0.0625);
	pixie.setMagn(0.25, 0.25);
	pixie.setRoot(0.5, 0.5);
	
	if (i == 0) {
		pixie.setLoc(400, 150);
		pixie.setMagn(1, 1);
		zone.addLeaf(pixie);
		continue;
	}
	
	pixies.push(pixie);
	troop.addLeaf(pixie);
}


function inputHandler(data, source) {
	if (data.f == vs.input.TouchFlag.MOVED) {
		var loc = zone.getLoc();
		loc[0] += data.xx;
		loc[1] += data.yy;
		zone.setLoc(loc);
	} 
};

function loop() {
	//return;
	var t = vs.now();
	
	var count = pixies.length;
	
	for (var i = 0; i < count; i++) {
		var pixie = pixies[i];
		
		var dx = parseInt(pixie.myo * Math.sin(pixie.mys * t / pixie.myr));
		var dy = parseInt(pixie.myo * Math.cos(pixie.mys * t / pixie.myr));
		
		pixie.setLoc(pixie.myx + dx, pixie.myy + dy);
		
		var a = vs.round((pixie.myw * t) % (2 * Math.PI), 4);
		
		pixie.setOri(a);
	}
	
	broadcast();
};

broadcast();
	});
})();

