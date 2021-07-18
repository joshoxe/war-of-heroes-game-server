import { User } from "../user";
import { GameRoom } from "../game-room";

export abstract class GameEventListener {
  eventHandlers: Handler[];

  execute(user: User, gameRoom: GameRoom, event: any, args: any[]): void {
    this.eventHandlers.forEach((eventHandler) => {
      if (event === eventHandler.event) {
        eventHandler.handler(user, gameRoom, args);
      }
    });
  }
}
