import { Socket } from "socket.io";

export class User {
    name: string;
    socket: Socket;
    jwtToken: string;
    accessToken: string;

    constructor(socket: Socket) {
        this.socket = socket;
    }
}