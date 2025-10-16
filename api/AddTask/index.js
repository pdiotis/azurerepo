const { CosmosClient } = require('@azure/cosmos');
const { v4: uuidv4 } = require('uuid');

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const dbName = process.env.COSMOS_DB || 'MyTasksDB';
const containerName = process.env.COSMOS_CONTAINER || 'tasks';

const client = new CosmosClient({ endpoint, key });
const container = client.database(dbName).container(containerName);

module.exports = async function (context, req) {
  try {
    const text = (req.body && req.body.text) || '';
    if (!text) return context.res = { status: 400, body: "Missing text" };

    const item = { id: uuidv4(), text, done: false, createdAt: new Date().toISOString() };
    const { resource } = await container.items.create(item);
    context.res = { status: 201, body: resource };
  } catch(err) {
    context.log.error(err);
    context.res = { status: 500, body: { error: err.message }};
  }
};
