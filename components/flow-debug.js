exports.group = 'flow';

function debugcomponent() {
	var self = this;

	self.on('msg', function(msg) {
		self.debug(msg);
	});

	return self;
}
FLOW.registerComponent('debug', debugcomponent);
