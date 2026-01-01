import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGODB_URL = process.env.MONGODB_URL;
const mongoDb_NAME = process.env.MONGODB_NAME;

async function connecdMongoDb() {
  try {
    const client = new MongoClient(MONGODB_URL);
    await client.connect();
    const db = client.db(mongoDb_NAME);
    console.log("connect mongoDb successfully");
    return db;
  } catch (error) {
    console.error(`Error coonected to mongoDb: ${error}`);
  }
}

const dataBaseMDB = await connecdMongoDb()
export default dataBaseMDB;