exports.group = 'flow';

// definice komponenty - hhtp route
function httpcomponent() {
	var self = this;

	if (!self.conf.url || self.conf.url === '')
		return self.error('httpcomponent-error-no-url-provided');

	var flags = [self.conf.method.toLowerCase()].concat(self.conf.flags || []);

	F.route(self.conf.url, function() {
		console.log('Incomming request');
		self.send({ controller: this });
	}, flags);

	// při změně v designéru je potřeba odstranit routu
	self.on('close', function() {
		F.routes.web.forEach(function(route, i, routes) {
			if (route.name === self.conf.url && route.method === self.conf.method)
				routes.splice(i, 1);
		});
		Object.keys(F.temporary.other).forEach(function(key) {
			if (key.startsWith('#' + self.conf.url) || key === self.conf.url) {
				delete F.temporary.other[key];
			}
		});
	});

	return self;
}
//FLOW.registerComponent('http', httpcomponent);


// definice komponenty - http response
function httpresponsecomponent() {
	var self = this;

	self.on('msg', function(msg) {
		console.log('Responding to request');
		msg.controller.json(msg.payload);
	});

	return self;
}
//FLOW.registerComponent('httpresponse', httpresponsecomponent);
