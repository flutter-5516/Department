import mongoose from "mongoose";

export const connectDb=async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URL,{
      dbName:"ManagementApp",
    })
    console.log("connected to Mongo db");
  }catch(err){
    console.log(err);
  }
}