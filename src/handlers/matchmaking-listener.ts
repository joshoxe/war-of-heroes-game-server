import { User } from "../user";
import { GameRoom } from "../game-room";
import { GameEventListener } from "./game-event-listener";

export class MatchmakingListener implements GameEventListener {
  eventHandlers: Handler[] = [
    {
      event: "matchmaking",
      handler: this.matchmakingHandler,
    },
  ];

  execute(user: User, gameRoom: GameRoom, event: any, args: any[]): void {
    this.eventHandlers.forEach((eventHandler) => {
      if (event === eventHandler.event) {
        eventHandler.handler(user, gameRoom, args);
      }
    });
  }

  matchmakingHandler(user: User, gameRoom: GameRoom, args: any[]): void {
      console.log("matchmaking: received command");
      if (args.length != 2) {
          user.socket.emit('message', 'matchmaking: Incorrect arguments');
          return;
      }

      const userName: string = args[0];
      const deckIds: number[] = args[1];

      if (userName === null || userName === undefined) {
          user.socket.emit('message', 'matchmaking: Unable to set username');
          return;
      }

      if (deckIds === null || deckIds === undefined) {
        user.socket.emit('message', 'matchmaking: Unable to set deck');
        return;
    }

    user.name = userName;
    user.deck = deckIds;

      // Is this room ready to play?
      if (gameRoom.users.length == 2) {
          console.log(`Sending ready event to room ${gameRoom.name}`);
          gameRoom.socket.emit('ready');
      }
  }
}
