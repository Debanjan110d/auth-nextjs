import mongoose from "mongoose";

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);// "!" to assert that the value is not null
        const connection = mongoose.connection;// This variable holds the dataase connection

        connection.on('connected', () => {
            console.log('Connected to MongoDB Sucessfully');
        })
        connection.on('error', (err) => {
            console.error('Error connecting to MongoDB:', err);
            process.exit();
        })
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}