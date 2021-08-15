import { Socket } from "socket.io";
import { Hero } from "./hero";

export class User {
    id: number;
    name: string;
    deck: Hero[];
    socket: Socket;
    jwtToken: string;
    accessToken: string;

    constructor(socket: Socket) {
        this.socket = socket;
    }
}
