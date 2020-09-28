const url = require("url");
const MongoClient = require("mongodb").MongoClient;

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cacheDb;
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true });

  const db = await client.db(url.parse(uri).pathname.substr(1));

  cacheDb = db;
  return db;
}

module.exports = async (req, res) => {
  const db = await connectToDatabase(process.env.MONGODB_URI);
  const collection = await db.collection("links");

  const tagsList = req.query.tags ? req.query.tags.split(",") : [];

  const query = {};

  if (tagsList.length) {
    query.tags = {
      $all: tagsList,
    };
  }

  const links = await collection.find(query).limit(15).toArray();

  res.json({
    tags: tagsList,
    body: links,
  });
};
