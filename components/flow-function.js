exports.group = 'flow';

function functioncomponent() {
	var self = this;

	self.on('data', function(msg){

		console.log('Funkce');
		msg = eval('(function() {' + self.conf.fn + '}())');
		console.log('MSG', msg);
		self.send(msg);
		
	});

	return self;
}
FLOW.registerComponent('function', functioncomponent);


