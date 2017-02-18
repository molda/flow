exports.group = 'flow';


function timercomponent() {
	var self = this;

	self.on('timer', function() {
		var msg = {};



		self.send(msg);
	});

	return self;
}
//FLOW.registerComponent('timer', timercomponent);
