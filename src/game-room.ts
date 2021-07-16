import { User } from "./user";
import { Guid } from "guid-typescript";
import { BroadcastOperator } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export class GameRoom {
    users: User[] = [];
    name: string;
    socket: BroadcastOperator<DefaultEventsMap>;

    constructor() {
        this.name = Guid.raw();
    }

    isRoomAvailable(): boolean {
        console.log(`Checking availability for room ${this.name} - users: ${this.users.length}`);
        console.log(this.users.length < 2);
        return this.users.length < 2;
    }

    addUser(user: User): void {
        this.users.push(user);
    }
}