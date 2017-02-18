exports.group = 'flow';


function triggercomponent() {
	var self = this;

	self.on('trigger', function() {
		var msg = {};

		switch (self.type) {
			case 'integer': 
				msg.data = parseInt(self.data);
				break;
			case 'float': 
				msg.data = parseFloat(self.data);
				break;
			case 'object': 
				msg.data = JSON.parse(self.data);
				break;
			case 'boolean': 
				msg.data = self.data === 'true' ? true : false;
				break;
			case 'string':
			default: 
				msg.data = self.data;
		}

		self.send(msg);
	});

	return self;
}
FLOW.registerComponent('trigger', triggercomponent);
