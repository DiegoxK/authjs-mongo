import { env } from "@/env";
import { MongoClient } from "mongodb";

const uri = env.MONGODB_URI;

if (!uri) throw new Error("MONGODB_URI not set in environment variables");

const client = new MongoClient(uri);
const clientPromise = client.connect();

export { clientPromise };
