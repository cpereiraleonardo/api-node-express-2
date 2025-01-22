import mongoose from "mongoose";

const dbConn = process.env.DB_CONNECTION_STRING;

mongoose.connect(dbConn);

let db = mongoose.connection;

export default db;
