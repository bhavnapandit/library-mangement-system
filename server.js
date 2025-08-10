import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import bookRoute from "./routes/bookRoutes.js"


const app = express()

dotenv.config()
app.use(express.json())
app.use(cors())

app.use("/api/book",bookRoute);
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

connectDb()
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server is running on ${port}`);
})

