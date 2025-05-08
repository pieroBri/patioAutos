import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import manejoReservas from './controllers/conections';

const app = express();
//const PORT = 4000;

const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  },
});

io.on('connection', (socket: Socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  manejoReservas(socket, io);

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });

  socket.on('ingreso', (usuario: string) => {
    console.log(usuario);
  });
});

app.get("/", (req, res) => {
  res.send("Express + Socket.io Server Running");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});