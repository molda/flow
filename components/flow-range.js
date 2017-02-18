exports.group = 'flow';

/*
- inmin 
- inmax

- outmin
- outmax

*/
function rangecomponent() {
	var self = this;

	self.on('msg', function(msg) {
		
		var inmin = parseFloat(self.conf.input_min || 0);
		var inmax = parseFloat(self.conf.input_max || 1023);
		var outmin = parseFloat(self.conf.output_min || 0);
		var outmax = parseFloat(self.conf.output_max || 1023);

		var val = msg.data;

		if (!val || typeof val === NaN) return self.debug({ componet: 'range', id: self.id, error: 'Value is not a number', msg: msg}, 'error');

		msg.data =  outmin + (outmax - outmin) * (val - inmin) / (inmax - inmin);

		self.send(msg);
	});

	return self;
}
FLOW.registerComponent('range', rangecomponent);
