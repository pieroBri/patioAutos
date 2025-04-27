const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');

const manejoReservas = require('./controllers/conections');

app.use(cors());

const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    manejoReservas(socket, io);
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
    socket.on('ingreso', (usuario) => {
        console.log(usuario);
    });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });