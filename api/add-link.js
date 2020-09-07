const url = require("url");
const MongoClient = require("mongodb").MongoClient;
const { linkPreview } = require(`link-preview-node`);

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

  // const example = {
  //   tags: [],
  //   url: ''
  // }
  console.log(JSON.parse(req.body));

  const { url, tags } = JSON.parse(req.body);

  // Sanitizing URLs
  if (!url.includes("https://")) url = `https://${url}`;

  linkPreview(url)
    .then(async (data) => {
      try {
        const request = await collection.insertOne(data);

        if (!request) {
          throw new Error("No se pudo guardar el link en Mongo");
        }

        res.json({
          body: data,
          tags: tags,
        });
      } catch (error) {
        res.status(500).send(err);
      }
    })
    .catch((err) =>
      res.status(500).send("No se pudo traer el preview del link")
    );
};
