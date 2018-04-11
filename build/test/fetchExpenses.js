var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Swagger = require('swagger-client');
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        const client = yield Swagger('http://petstore.swagger.io/v2/swagger.json');
        console.log(client.spec);
        console.log(client.originalSpec);
        console.log(client.errors);
        client.apis.pet.addPet({ id: 1, name: "bobby" }).then(ok => {
            console.log(ok);
        });
        client.execute({
            operationId: 'addPet', parameters: {
                id: 1,
                name: "bobby"
            }
        }).then(ok => {
            console.log(ok);
        });
    }
    catch (e) {
        console.error(e);
    }
}))();
//# sourceMappingURL=fetchExpenses.js.map