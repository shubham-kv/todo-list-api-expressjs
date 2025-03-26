import mongoose from "mongoose";

export async function initiateDbConnection(): Promise<void> {
  const mongoUri =
    process.env.NODE_ENV === "test"
      ? (process.env.TEST_MONGO_URI as string)
      : (process.env.MONGO_URI as string);

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log("Failed to connect to MongoDB");
    console.error(e);
  }
}

export async function terminateDbConnection(): Promise<void> {
  try {
    await mongoose.connection.close();
  } catch (e) {
    console.log("Failed while disconnecting to MongoDB");
    console.error(e);
  }
}
