import * as permify from '@permify/permify-node';
import permifySchema from './schema' //it imports permify schema

//Read offical documentation and configure, please vist:[https://docs.permify.co/getting-started/quickstart]
//Make sure to connect permify
const client = new permify.grpc.newClient({
    endpoint: "localhost:3478",
})

//This class deals permify configuration related works
class PermifyConfiguration {
    #tenantId = 't1';
    constructor() {
        this.createTenant();
        this.createSchema();
        this.listSchema();
        this.provideAcess();
    }
    //Create tenant first
    createTenant = async () => {
        try {
            const tenant = await client.tenancy.create({
                id: this.#tenantId,
                name: "tenant 1"
            });

            if (Object.keys(tenant).length == 0) {
                console.log('Tanent creation failed');
            }
            console.log("Tenant response:", tenant);
        }
        catch (error) {
            console.log("Tenant error:", error.message);
        }
    }
    //Use tenant id to create permission schema 
    //Make sure to refer documentation to configure schema
    createSchema = async () => {
        try {
            const schema = await client.schema.write({
                tenantId: this.#tenantId,
                schema: permifySchema
            });

            console.log('Schema response:', schema);
        }
        catch (error) {
            console.log('Schema error:', error.message);
        }
    }
    //List all the available schemas
    listSchema = async () => {
        try {
            const permifyList = await fetch(`http:localhost:3476/v1/tenants/${this.#tenantId}/schemas/list`, {
                method: 'post'
            });
            const response = await permifyList.json();
            console.log('Permify list response:', response);
        }
        catch (error) {
            console.log('Permify list error:', error.message);
        }
    }
    //provide acess to the particular user to particular entity for particular role
    provideAcess = async () => {
        try {
            const acess = await client.data.write({
                tenantId: "t1",
                metadata: {
                    schemaVersion: ""
                },
                tuples: [
                    {
                        entity: {
                            type: "team",
                            id: "1"
                        },
                        relation: "technical",
                        subject: {
                            type: "user",
                            id: "alicee"
                        }
                    }
                ]
            });

            console.log('Acess response:', acess);
        }
        catch (error) {
            console.log('Acess error:', error.message);
        }
    }
}

export { client };
export default PermifyConfiguration;