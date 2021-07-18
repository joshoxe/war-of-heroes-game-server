import { GameRoom } from "../game-room";
import { User } from "../user";
import { GameEventListener } from "./game-event-listener";

export class DisconnectListener extends GameEventListener {
    eventHandlers: Handler[] = [
        {
            event: "disconnect",
            handler: this.disconnectHandler
        }
    ];
    
    disconnectHandler(user: User, gameRoom: GameRoom, args: any[]) {
        console.log(`${user.name} has disconnected`);
        gameRoom.removeUser(user);
        gameRoom.socket.emit("quit", `${user.name}`);
    }
}