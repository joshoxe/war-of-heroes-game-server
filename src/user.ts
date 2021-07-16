import { Socket } from "socket.io";

export class User {
    name: string;
    socket: Socket;
    deck: number[];

    constructor(socket: Socket) {
        this.socket = socket;
    }
}