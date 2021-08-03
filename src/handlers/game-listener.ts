import { UserApi } from "../API/user-api";
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

    userApi: UserApi;
    
    winHandler(user: User, gameRoom: GameRoom, args: any[]) {
        console.log("Got a winner!");

        // Add win to winners record
        this.userApi = new UserApi();

        // TODO: In eventual game class, store coins literal as const
        this.userApi.recordWin(user, 50);

        // Add loss for everyone else in the room
        for (let i = 0; i < gameRoom.users.length; i++) {
            const gameRoomUser = gameRoom.users[i];

            if (gameRoomUser === user) {
                continue;
            }
            // TODO: As above
            this.userApi.recordLoss(gameRoomUser, 5);
        }

        // Tell the client they won
        user.socket.emit("win");
        // Tell the opponent they lost
        user.socket.to(gameRoom.name).emit("lose");
    }
}