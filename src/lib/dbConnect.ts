import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connection:connectionObject = {}
async function dbConnect(): Promise<void> {
     
    if(connection.isConnected){
         console.log('DB is already Connected');
         return ; }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '' , {
            serverSelectionTimeoutMS: 300000
          });
        connection.isConnected = db.connections[0].readyState ;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit();
    }
}

export default dbConnect;