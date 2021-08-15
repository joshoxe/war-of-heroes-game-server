import { User } from "../user";
import { GameRoom } from "../game-room";
import { GameEventListener } from "./game-event-listener";
import { HeroApi } from "../API/hero-api";
import { Hero } from "../hero";

export class MatchmakingListener extends GameEventListener {
  eventHandlers: Handler[] = [
    {
      event: "matchmaking",
      handler: this.matchmakingHandler,
    },
    { 
      event: "myDeck",
      handler: this.sendUserDeck
    }
  ];

  async matchmakingHandler(user: User, gameRoom: GameRoom, args: any[]): Promise<void> {
    console.log("matchmaking: received command");
    // Expecting an event of -> matchmaking: id, username, deck, jwt, access token
    if (args.length != 5) {
      user.socket.emit("message", args);
      user.socket.emit("message", "matchmaking: Incorrect arguments");
      return;
    }

    const id: number = args[0]
    const userName: string = args[1];
    const deck: number[] = args[2]
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

    if (deck === null || deck === undefined) {
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

    // Retrieve hero objects from deck IDs
    const heroApi = new HeroApi();
    await heroApi.getHeroes(user, deck).then((deckHeroes: Hero[]) => {
      user.deck = deckHeroes
    });

    // Is this room ready to play?
    if (gameRoom.users.length == 2) {
      console.log(`Sending ready event to room ${gameRoom.name}`);
      // Tell the client the room is ready, and send their deck in Hero form
      gameRoom.socket.emit("ready", user.deck);
    }
  }

  sendUserDeck(user: User, gameRoom: GameRoom, args: any[]) {
    // Send the rest of the clients the deck in Hero form
    const userDeck: Hero[] = args;
    user.socket.to(gameRoom.name).emit('opponentDeck', userDeck);
  }
}
