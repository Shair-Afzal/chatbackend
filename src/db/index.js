import mongoose from "mongoose";
import { dbname } from "../constant.js";
import dotenv from "dotenv";

dotenv.config();

const Connectdb = async () => {
  const url = process.env.MONGODB_URL;
  try {
    const connectioninstance = await mongoose.connect(
      "mongodb://hunaizk018_db_user:GoogleTest@ac-n73ewd2-shard-00-00.iss5qme.mongodb.net:27017,ac-n73ewd2-shard-00-01.iss5qme.mongodb.net:27017,ac-n73ewd2-shard-00-02.iss5qme.mongodb.net:27017/Chatbackend?ssl=true&replicaSet=atlas-13dbcd-shard-0&authSource=admin&appName=Cluster0",
    );
    console.log("mongo db connected", connectioninstance.connection.host);
    console.log("Host:", connectioninstance.connection.host);
    console.log("Database:", connectioninstance.connection.name);
  } catch (err) {
    console.log("ERROR:", err);
    process.exit(1);
  }
};

export default Connectdb;
