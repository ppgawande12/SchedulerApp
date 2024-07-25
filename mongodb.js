import { config } from "dotenv";
config();

import { MongoClient, ServerApiVersion } from "mongodb";

const uri = Deno.env.get("MONGODB_URL")||process.env.MONGODB_URL;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    tls: true,
    ssl: true,
    tlsAllowInvalidCertificates: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
});

export async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.log(error);
  } finally {
  }
}

export default client;
