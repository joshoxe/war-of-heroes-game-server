import { User } from "../user";
import { GameRoom } from "../game-room";
import { GameEventListener } from "./game-event-listener";

export class MatchmakingListener extends GameEventListener {
  eventHandlers: Handler[] = [
    {
      event: "matchmaking",
      handler: this.matchmakingHandler,
    },
  ];

  matchmakingHandler(user: User, gameRoom: GameRoom, args: any[]): void {
    console.log("matchmaking: received command");
    // Expecting an event of -> matchmaking: id, username, jwt, access token
    if (args.length != 4) {
      user.socket.emit("message", args);
      user.socket.emit("message", "matchmaking: Incorrect arguments");
      return;
    }

    const id: number = args[0]
    const userName: string = args[1];
    const jwtToken: string = args[2];
    const accessToken: string = args[3];

    if (id === null || id === undefined) {
      user.socket.emit("message", "matchmaking: Unable to set ID");
      return;
    }

    if (userName === null || userName === undefined) {
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

    // Is this room ready to play?
    if (gameRoom.users.length == 2) {
      console.log(`Sending ready event to room ${gameRoom.name}`);
      gameRoom.socket.emit("ready");
    }
  }
}
