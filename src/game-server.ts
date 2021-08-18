import { createServer } from "http";
import { Server, Socket } from "socket.io";
import  { Express } from "express";
import { GameRoom } from "./game-room";
import { DisconnectListener } from "./handlers/disconnect-listener";
import { EventHandler } from "./handlers/event-handler";
import { GameListener } from "./handlers/game-listener";
import { MatchmakingListener } from "./handlers/matchmaking-listener";
import { User } from "./user";
import { Game } from "./game";

export class GameServer {
  games: Game[] = [];
  eventHandler: EventHandler;
  fs = require('fs');
  log_file = this.fs.createWriteStream('debug.log', {flags : 'w'});
  express = require('express');

  listen(port: string | number): void {
    this.eventHandler = new EventHandler();
    this.createHandlers();

    const httpServer = createServer(this.express());
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
      const game = this.getAvailableGame() ?? this.createNewGame();
      socket.join(game.gameRoom.name);
      game.gameRoom.addUser(user);
      game.gameRoom.socket = io.to(game.gameRoom.name);
      this.log_file.write(`Added new connection to game room ${game.gameRoom.name}`);
      console.log(`Added new connection to game room ${game.gameRoom.name}`);


      // Send the client a matchmaking request
      socket.emit('matchmaking');

      /* Send events to an event hanlder */
      socket.onAny((eventType, args) => {
        this.eventHandler.notify(user, game, eventType, args);
      });
    });
  }

  private createNewGame(): Game {
    const gameRoom = new GameRoom();
    const game = new Game(gameRoom);
    this.games.push(game);

    return game;
  }

  private createHandlers(): void {
    this.eventHandler.subscribe(new MatchmakingListener());
    this.eventHandler.subscribe(new DisconnectListener());
    this.eventHandler.subscribe(new GameListener());
  }

  private getAvailableGame(): Game {
    var availableGame: Game = null;

    this.games.forEach((game) => {
      if (game.gameRoom.isRoomAvailable()) {
        availableGame = game;
      }
    });

    return availableGame;
  }
}
