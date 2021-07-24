import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { GameRoom } from "./game-room";
import { DisconnectListener } from "./handlers/disconnect-listener";
import { EventHandler } from "./handlers/event-handler";
import { GameListener } from "./handlers/game-listener";
import { MatchmakingListener } from "./handlers/matchmaking-listener";
import { User } from "./user";

export class GameServer {
  rooms: GameRoom[] = [];
  eventHandler: EventHandler;
  fs = require('fs');
  log_file = this.fs.createWriteStream('debug.log', {flags : 'w'});

  listen(port: string | number): void {
    this.eventHandler = new EventHandler();
    this.createHandlers();

    const httpServer = createServer();
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });


    this.log_file.write(`Listening on port ${port}...`);
    console.log(`Listening on port ${port}...`);
    httpServer.listen(port);

    io.on("connection", (socket: Socket) => {
      /* Handle a new incoming connection */
      console.log("Handling a new connection");
      this.log_file.write("Handling a new connection");
      const user = new User(socket);
      const gameRoom = this.getAvailableRoom() ?? this.createNewRoom();
      socket.join(gameRoom.name);
      gameRoom.addUser(user);
      gameRoom.socket = io.to(gameRoom.name);
      this.log_file.write(`Added new connection to game room ${gameRoom.name}`);
      console.log(`Added new connection to game room ${gameRoom.name}`);

      // Send the client a matchmaking request
      socket.emit('matchmaking');

      /* Send events to an event hanlder */
      socket.onAny((eventType, args) => {
        this.eventHandler.notify(user, gameRoom, eventType, args);
      });
    });
  }

  private createNewRoom(): GameRoom {
    const gameRoom = new GameRoom();
    this.rooms.push(gameRoom);

    return gameRoom;
  }

  private createHandlers(): void {
    this.eventHandler.subscribe(new MatchmakingListener());
    this.eventHandler.subscribe(new DisconnectListener());
    this.eventHandler.subscribe(new GameListener());
  }

  private getAvailableRoom(): GameRoom {
    var availableRoom: GameRoom = null;

    this.rooms.forEach((room) => {
      if (room.isRoomAvailable()) {
        availableRoom = room;
      }
    });

    return availableRoom;
  }
}
