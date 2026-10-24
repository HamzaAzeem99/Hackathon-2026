import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dns from "dns"

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Hackathon Backend is running!"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "OK"
    });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

startServer();
