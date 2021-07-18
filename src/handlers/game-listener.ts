import { GameRoom } from "../game-room";
import { User } from "../user";
import { GameEventListener } from "./game-event-listener";

export class GameListener extends GameEventListener {
    eventHandlers: Handler[] = [
        {
            event: "win",
            handler: this.winHandler
        }
    ];
    
    winHandler(user: User, gameRoom: GameRoom, args: any[]) {
        console.log("Got a winner!");
        // Tell the client they won
        user.socket.emit("win");
        // Tell the opponent they lost
        user.socket.to(gameRoom.name).emit("lose");
    }
}