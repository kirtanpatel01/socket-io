import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import dataRouter from './routers/data.routers.js';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL;
const DB_NAME = process.env.DB_NAME;
const server = createServer(app);

const io = new Server(server, {
    cors: "http://localhost:5173",
    credentials: true
});

app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
    }),
);

app.use((req, res, next) =>{
    req.io = io;
    next();
})

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
