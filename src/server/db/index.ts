import { env } from "@/env";
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
if (env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };
  globalWithMongo._mongoClient ??= new MongoClient(uri, options);
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

// Connect to the MongoDB database
const db = client.db(env.MONGODB_DATABASE_NAME ?? "your-default-db-name");

// Export the client for auth adapter
export default client;

// Export the database for tRPC context
export { db };
