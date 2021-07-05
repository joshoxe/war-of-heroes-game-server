import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

io.on("connection", (socket: Socket) => {
  console.log("Got a client");
  socket.emit('MATCHMAKE');

  socket.on("MATCHMAKE", (data) => {
    console.log("Received MATCHMAKE from Client:", data);
  })
});

io.on('disconnect', () => {
  console.log("Client disconnected");
})

console.log("Listening for clients..");
httpServer.listen(3000);
