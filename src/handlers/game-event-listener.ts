import { User } from "../user";
import { GameRoom } from "../game-room";

export interface GameEventListener {
    eventHandlers: Handler[];

    execute(user: User, gameRoom: GameRoom, event: any, args: any[]): void;
}