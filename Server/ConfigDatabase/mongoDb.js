import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB ");
    });

    mongoose.connection.on("error", (err) => {
      console.log(`Error connecting to MongoDB: ${err}`);
      process.exit(1);
    });

    mongoose.connect(process.env.MONGO_DB_URI);
  } catch (error) {
    console.log(error);
    console.log(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
