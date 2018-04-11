// import Swagger from 'swagger-client';
const Swagger = require('swagger-client');

// https://docs.finapi.io/js/swagger.json
(async () => {
	try {
		const client = await Swagger('http://petstore.swagger.io/v2/swagger.json');
		console.log(client.spec); // The resolved spec
		console.log(client.originalSpec); // In case you need it
		console.log(client.errors); // Any resolver errors

		// Tags interface
		client.apis.pet.addPet({id: 1, name: "bobby"}).then(ok => {
			console.log(ok);
		});

		// TryItOut Executor, with the `spec` already provided
		client.execute({
			operationId: 'addPet', parameters: {
				id: 1,
				name: "bobby"
			}
		}).then(ok => {
			console.log(ok);
		});
	} catch (e) {
		console.error(e);
	}
})();
