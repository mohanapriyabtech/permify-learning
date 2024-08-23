import * as permify from '@permify/permify-node';
import permifySchema from './schema'; // Import the Permify schema

const client = new permify.grpc.newClient({
  endpoint: "localhost:3478",
});

class PermifyConfiguration {
  #tenantId = 't1';

  constructor() {
    this.initializePermify();
  }

  async initializePermify() {
    await this.createTenant();
    await this.createSchema();
  }

  // Create tenant
  async createTenant() {
    try {
      const tenant = await client.tenancy.create({
        id: this.#tenantId,
        name: "tenant 1",
      });

      if (!tenant || Object.keys(tenant).length === 0) {
        console.log('Tenant creation failed');
      } else {
        console.log("Tenant created:", tenant);
      }
    } catch (error) {
      console.log("Tenant error:", error.message);
    }
  }

  // Create permission schema
  async createSchema() {
    try {
      const schema = await client.schema.write({
        tenantId: this.#tenantId,
        schema: permifySchema,
      });

      console.log('Schema created:', schema);
    } catch (error) {
      console.log('Schema error:', error.message);
    }
  }
}

export { client, PermifyConfiguration };
