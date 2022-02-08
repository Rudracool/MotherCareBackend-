function service(request, response)
{
	'use strict';
	try 
	{
		require('PageType.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PageType.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}