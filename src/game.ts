import { GameRoom } from "./game-room";
import { Player } from "./player";

export class Game {
  players: Player[];
  gameRoom: GameRoom;
  currentTurnPlayer: Player;
  playersReady: number = 0;
  currentPlays: number = 0;
  maxPlays: number = 3;

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
    console.log("Starting a new game");
    for (let i = 0; i < this.players.length; i++) {
      const player: Player = this.players[i];
      console.log(`Getting a new hand for ${player.name}`);
      player.drawNewHand();
      const playerData = this.getPlayerData(player);
      player.socket.emit("newPlayerHand", playerData);
      player.socket.to(this.gameRoom.name).emit("newOpponentHand", playerData);
    }

    this.pickRandomFirstTurn();
  }

  updatePlayer(newPlayer: Player) {
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];

      if (newPlayer === player) {
        this.players[i] = newPlayer;
      }

      if (this.players[i].health <= 0) {
        this.players[i].socket.emit("lose");
        this.players[i].socket.to(this.gameRoom.name).emit("win");
        return;
      }
    }
  }

  getPlayerData(player: Player) {
    for (let i = 0; i < this.players.length; i++) {
      const gamePlayer = this.players[i];

      if (player === gamePlayer) {
        return {
          name: gamePlayer.name,
          health: gamePlayer.health,
          inventoryIds: gamePlayer.inventoryIds,
          inventory: gamePlayer.inventory,
          discardPile: gamePlayer.discardPile,
          currentHand: gamePlayer.currentHand,
        };
      }
    }
  }

  getCurrentNonPlayer(): Player {
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];

      if (player !== this.currentTurnPlayer) {
        return player;
      }
    }
  }

  async increaseCurrentPlays() {
    this.currentPlays++;

    if (this.currentPlays >= this.maxPlays) {
      const newHand = this.currentTurnPlayer.drawNewHand();

      this.currentTurnPlayer.socket.emit("endPlayerTurn");
      this.currentPlays = 0;

      this.currentTurnPlayer.socket.emit("newPlayerHand", this.getPlayerData(this.currentTurnPlayer));

      this.currentTurnPlayer.socket.to(this.gameRoom.name).emit("newOpponentHand", this.getPlayerData(this.currentTurnPlayer));

      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i];

        if (player !== this.currentTurnPlayer) {
          this.currentTurnPlayer = player;
          break;
        }
      }

      this.sendNextTurnEvent();
    }
  }

  private pickRandomFirstTurn() {
    const randomFirstTurn = Math.floor(Math.random() * this.players.length);
    this.currentTurnPlayer = this.players[randomFirstTurn];

    this.sendNextTurnEvent();
  }

  private sendNextTurnEvent() {
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];

      if (player === this.currentTurnPlayer) {
        this.currentTurnPlayer = player;
        player.socket.emit("playerTurn");
      } else {
        player.socket.emit("opponentTurn");
      }
    }
  }
}
