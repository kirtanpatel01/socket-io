import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import dataRouter from './routers/data.routers.js';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from "url";
import path from 'path';

config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL;
const ORIGIN = process.env.ORIGIN;
const DB_NAME = process.env.DB_NAME;
const server = createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const io = new Server(server, {
    cors: [ORIGIN, 'http://localhost:5173'],
    credentials: true
});

app.use(
    cors({
        origin: [ORIGIN, 'http://localhost:5173'],
        credentials: true,
    }),
);

app.use((req, res, next) =>{
    req.io = io;
    next();
})

app.use(express.static(path.join(__dirname, "/")));

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


mongoose.connect(`${MONGODB_URL}/${DB_NAME}`).then(() => {
    console.log("MongoDB is connected now!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/data", dataRouter);

io.on('connection', (socket) => {
    // console.log("A user connected!");
    socket.on('disconnect', () => {
        // console.log('A user disconnected!');
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
