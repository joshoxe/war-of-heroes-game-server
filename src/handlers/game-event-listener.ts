import { User } from "../user";
import { GameRoom } from "../game-room";
import { Game } from "../game";

export abstract class GameEventListener {
  eventHandlers: Handler[];

  execute(user: User, game: Game, event: any, args: any[]): void {
    this.eventHandlers.forEach((eventHandler) => {
      if (event === eventHandler.event) {
        eventHandler.handler(user, game, args);
      }
    });
  }
}
