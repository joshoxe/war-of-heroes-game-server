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
    // Expecting an event of -> matchmaking: username, jwt, access token
    if (args.length != 3) {
      user.socket.emit("message", "matchmaking: Incorrect arguments");
      return;
    }

    const userName: string = args[0];
    const jwtToken: string = args[1];
    const accessToken: string = args[2];

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
