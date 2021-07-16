import { User } from "../user";
import { GameRoom } from "../game-room";
import { GameEventListener } from "./game-event-listener";

export class EventHandler {
  subscribers: GameEventListener[] = [];

  subscribe(subscriber: GameEventListener): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: GameEventListener): void {
    const index = this.subscribers.indexOf(subscriber, 0);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  notify(user: User, gameRoom: GameRoom, event: any, args: any[]) {
      this.subscribers.forEach(subscriber => {
          subscriber.execute(user, gameRoom, event, args);
      });
  }
}
