import { GameRoom } from "./game-room";
import { Player } from "./player";

export class Game {
    players: Player[];
    gameRoom: GameRoom;
    currentTurn: Player;
    playersReady: number = 0;
    
    constructor(gameRoom: GameRoom) {
        this.gameRoom = gameRoom;
        this.players = [];
    }

    addPlayer(player: Player) {
        if (this.players.length >= 2) {
            return;
        }

        this.players.push(player);
    }

    startNewGame() {
        console.log('Starting a new game');
        for (let i = 0; i < this.players.length; i++) {
            const player: Player = this.players[i];
            console.log(`Getting a new hand for ${player.name}`);
            const newHand = player.drawNewHand();
            player.socket.emit('newPlayerHand', newHand);
            player.socket.to(this.gameRoom.name).emit('newOpponentHand', newHand);
        }
    }
    
}