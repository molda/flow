var util = require('util');
var EventEmitter = require('events');


function Component(config) {
	var self = this;
	U.extend(self, config);
}

util.inherits(Component, EventEmitter);

Component.prototype.send = function(msg) {

	// pokud je msg Array a položky v connections taky tak se každá položka z msg posílá na jiný výstup
	// connections by mělo vypadat nějak takhle
	// [ ['id1', id2], ['id3'], ['id4']]
	// a msg [{...}, {...}, {...}]
	// takže např. msg[0] se pošle do komponenty id1 a id2
	// msg[1] se pošle do komponenty id3
	// msg[2] se pošle do komponenty id4

	var isArray = msg instanceof Array;

	var conns = this.connections || [];
	if (conns.length) {
		for (var i = 0; i < conns.length; i++) {
			var w = conns[i];
			if (w instanceof Array && isArray) {
				for (var j = 0; j < w.length; i++) {
					var m = msg[j];
					//if (!(m instanceof Message)) m = new Message(m);
					var instance = FLOW.getInstance(w);
					if(instance) instance.emit('msg', m);
				}
			} else {
				//if (!(msg instanceof Message)) msg = new Message(msg);
				var instance = FLOW.getInstance(w);
				if(instance) instance.emit('msg', msg);
			}
		}
	}
};

/*
	pro odesílání statusu do designéru
	např. u websocket(nebo mqtt) klienta, jestli je připojen nebo ne
*/
Component.prototype.status = function(status) {
	// odešle status přes websocket do designéru
	// např. -> status === {text: 'Connected', color: 'green'} 
	WSCONTROLLER.send({ target: this.id, type: 'status', msg: status });
	return this;
};

/*
	sends message to debug window in designer
*/
Component.prototype.debug = function(msg) {

	if (!msg) return;

	// type = info (black text), error (red text), warning (orange text) ????????

	// to prevent `TypeError: Converting circular structure to JSON`
	function stringify(o){
		// http://stackoverflow.com/a/11616993/3284355
		var cache = [];
		o = JSON.stringify(o, function(key, value) {
		    if (typeof value === 'object' && value !== null) {
		        if (cache.indexOf(value) !== -1) {
		            // Circular reference found, discard key
		            return;
		        }
		        // Store value in our collection
		        cache.push(value);
		    }
		    return value;
		}, '  ');
		cache = null;
		return o;
	}

	// odešle error přes websocket do designéru
	WSCONTROLLER.send({ target: 'debugwindow', type: 'debug', msg: stringify(msg) });
	return this;
};



function Flow() {
	var self = this;

	// registered components
	self.components = {};

	// instances of components
	self.instances = {};

	return self;
}

Flow.prototype.registerComponent = function(name, fn) {
	var self = this;

	self.components[name] = fn;

	return self;	
};

// get component for instantiation
Flow.prototype.getComponent = function(name) {
	return this.components[name];
};

// get the instance of component by ID
Flow.prototype.getInstance = function(id) {
	return this.instances[id];
};

// při změně v designéru zavoláme u všech komponent událost `close`, např. hhtpcomponent odstraní routu
Flow.prototype.reset = function(name) {
	var self = this;

	Object.keys(self.instances).forEach(function(comp) {
		self.instances[comp].emit('close');
	});
	self.instances = {};
};

// při změně v designéru vytvoříme instance všech komponent
Flow.prototype.instantiateComponents = function(components) {
	var self = this;

	// možná to bude chtít timeout nebo callback????
	self.reset();

	if(!components || !components.length) return;

	components.forEach(function(comp) {

		var c = self.getComponent(comp.component);

		//if(!c) return WSCONTROLLER.send({ target: 'debugwindow', type: 'error', msg: 'Unknown component:' + comp.component });

		self.instances[comp.id] = c.call(new Component(comp));
	});
};


global.FLOW = new Flow();
