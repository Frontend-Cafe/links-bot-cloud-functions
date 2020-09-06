const url = require("url");
const MongoClient = require("mongodb").MongoClient;
const { linkPreview } = require(`link-preview-node`);

// let cachedDb = null;

// async function connectToDatabase(uri) {
//   if (cachedDb) {
//     return cacheDb;
//   }

//   const client = await MongoClient.connect(uri, { useNewUrlParser: true });

//   const db = await client.db(url.parse(uri).pathname.substr(1));

//   cacheDb = db;
//   return db;
// }

module.exports = async (req, res) => {
  //   const db = await connectToDatabase(process.env.MONGODB_URI);
  //   const collection = await db.collection("links");
  //   const links = await collection.find({}).toArray();

  // const tags = req.query.tags

  let url = req.query.url || "google.com";

  if (!url.includes("https://")) url = `https://${url}`;

  linkPreview(url)
    .then((data) =>
      res.json({
        body: data,
      })
    )
    .catch((err) => console.error(err));
};
