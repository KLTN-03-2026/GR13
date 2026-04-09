import "dotenv/config";
import express from "express";
import cors from "cors";
import initRoutes from "./src/routes";
const app = express();
const server = require("http").createServer(app);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
initRoutes(app);
const PORT = process.env.PORT || 8088;
server.listen(PORT, () => {
  console.log(`🚀 SERVER IS RUNNING ON PORT ${PORT}`);
});
