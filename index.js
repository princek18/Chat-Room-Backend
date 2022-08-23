const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const users = {};
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:19006",
  },
});

io.on("connection", (socket) => {
  socket.on("new-user-connected", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-added", name);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", { message, name: users[socket.id] });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(5000, () => {
  console.log("Running on 5000");
});
