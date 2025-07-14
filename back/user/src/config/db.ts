import mongoose from "mongoose";

const mongoUri = "mongodb://0.0.0.0:27017/proyectooo";
const connectDB = async(): Promise<void> => {
    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

export default connectDB;