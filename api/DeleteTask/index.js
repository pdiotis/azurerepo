const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const dbName = process.env.COSMOS_DB || 'MyTasksDB';
const containerName = process.env.COSMOS_CONTAINER || 'tasks';

const client = new CosmosClient({ endpoint, key });
const container = client.database(dbName).container(containerName);

module.exports = async function (context, req) {
  try {
    const id = (req.body && req.body.id);
    if (!id) return context.res = { status: 400, body: "Missing id" };
    await container.item(id, id).delete();
    context.res = { status: 204 };
  } catch(err) {
    context.log.error(err);
    context.res = { status: 500, body: { error: err.message }};
  }
};
