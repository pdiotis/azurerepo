const { BlobServiceClient } = require('@azure/storage-blob');

const connStr = process.env.STORAGE_CONNECTION_STRING;
const containerName = process.env.STORAGE_CONTAINER || 'attachments';
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient(containerName);

module.exports = async function(context, req) {
  try {
    const { id, filename, data } = req.body || {};
    if (!id || !data) return context.res = { status: 400, body: "Missing id or data" };

    const buffer = Buffer.from(data, 'base64');
    const name = filename || `${id}.bin`;
    const blockBlobClient = containerClient.getBlockBlobClient(name);
    await blockBlobClient.uploadData(buffer);
    context.res = { status: 201, body: { url: blockBlobClient.url }};
  } catch(err) {
    context.log.error(err);
    context.res = { status: 500, body: { error: err.message }};
  }
};
