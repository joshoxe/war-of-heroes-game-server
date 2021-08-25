import { User } from "../user";
import { GameRoom } from "../game-room";
import { GameEventListener } from "./game-event-listener";
import { HeroApi } from "../API/hero-api";
import { Hero } from "../hero/hero";
import { Player } from "../player";
import { Game } from "../game";

export class MatchmakingListener extends GameEventListener {
  eventHandlers: Handler[] = [
    {
      event: "matchmaking",
      handler: this.matchmakingHandler,
    },
    { 
      event: "myInfo",
      handler: this.sendUserInfo
    },
    {
      event: "ready",
      handler: this.startGame
    }
  ];

  async matchmakingHandler(user: User, game: Game, args: any[]): Promise<void> {
    console.log("matchmaking: received command");
    // Expecting an event of -> matchmaking: id, username, deck, jwt, access token
    if (args.length != 5) {
      user.socket.emit("message", args);
      user.socket.emit("message", "matchmaking: Incorrect arguments");
      return;
    }

    const id: number = args[0]
    const userName: string = args[1];
    const player: Player = args[2]
    const jwtToken: string = args[3];
    const accessToken: string = args[4];

    if (id === null || id === undefined) {
      user.socket.emit("message", "matchmaking: Unable to set ID");
      return;
    }

    if (userName === null || userName === undefined) {
      user.socket.emit("message", "matchmaking: Unable to set username");
      return;
    }

    if (player === null || player === undefined) {
      user.socket.emit("message", "matchmaking: Unable to set username");
      return;
    }

    if (jwtToken === null || jwtToken === undefined) {
      user.socket.emit("message", "matchmaking: Unable to set JWT Token");
      return;
    }

    if (accessToken === null || accessToken === undefined) {
      user.socket.emit("message", "matchmaking: Unable to set Access Token");
      return;
    }

    user.id = id;
    user.name = userName;
    user.jwtToken = jwtToken;
    user.accessToken = accessToken;

    // Retrieve hero objects from inventory IDs
    const heroApi = new HeroApi();
    await heroApi.getHeroes(user, player.inventoryIds).then((inventoryHeroes: Hero[]) => {
      user.inventory = inventoryHeroes
    });

    console.log(`Got player inventory: sending event`);
    user.socket.emit('playerInventory', user.inventory);

        // Is this room ready to play?
        if (game.gameRoom.users.length == 2) {
          console.log(`${game.gameRoom.name} has two paired players. Sending event`);
          // Tell the room they have matched
          game.gameRoom.socket.emit('roomReady');
        }
  }

  sendUserInfo(user: User, game: Game, args: Player) {
    const player: Player = new Player(args.name, args.inventory, user.socket);
    user.socket.to(game.gameRoom.name).emit('opponentInfo', args);
    console.log(`Got info for ${player.name}, adding them to game`)
    game.addPlayer(player);
  }

  startGame(user: User, game: Game, args: any[]) {
    game.playersReady++;
 
    // Is this room ready to play?
    console.log(`fot ready event, players ready: ${game.playersReady}`)
    if (game.playersReady == 2) {
      console.log(`${game.gameRoom.name} has two paired players. Starting game`);
      // Tell the room the game is ready to start
      game.startNewGame();
    }
  }
}
