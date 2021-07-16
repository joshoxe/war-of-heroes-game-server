import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { GameRoom } from "./game-room";
import { EventHandler } from "./handlers/event-handler";
import { MatchmakingListener } from "./handlers/matchmaking-listener";
import { User } from "./user";

export class GameServer {
  rooms: GameRoom[] = [];
  eventHandler: EventHandler;

  listen(port: number): void {
    this.eventHandler = new EventHandler();
    this.createHandlers();

    const httpServer = createServer();
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });


    console.log(`Listening on port ${port}...`);
    httpServer.listen(port);

    io.on("connection", (socket: Socket) => {
      console.log("Handling a new connection");
      const user = new User(socket);
      const room = this.getAvailableRoom();
      const gameRoom = this.getAvailableRoom() ?? this.createNewRoom();
      socket.join(gameRoom.name);
      gameRoom.addUser(user);
      gameRoom.socket = io.to(gameRoom.name);
      console.log(`Added new connection to game room ${gameRoom.name}`);

      // Send the client a matchmaking request
      socket.emit('matchmaking');

      socket.onAny((eventType, args) => {
        this.eventHandler.notify(user, gameRoom, eventType, args);
      });
    });
  }

  createNewRoom(): GameRoom {
    const gameRoom = new GameRoom();
    this.rooms.push(gameRoom);

    return gameRoom;
  }

  createHandlers(): void {
    this.eventHandler.subscribe(new MatchmakingListener());
  }

  getAvailableRoom(): GameRoom {
    var availableRoom: GameRoom = null;

    this.rooms.forEach((room) => {
      if (room.isRoomAvailable()) {
        availableRoom = room;
      }
    });

    return availableRoom;
  }

  findUserRoom(socket: Socket): GameRoom {
    this.rooms.forEach(room => {
      room.users.forEach(user => {
        if (user.socket === socket) {
          return room;
        }
      });
    });

    return null;
  }
}
