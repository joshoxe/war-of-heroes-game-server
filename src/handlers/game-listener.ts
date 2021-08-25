import { Game } from "../game";
import { UserApi } from "../API/user-api";
import { GameRoom } from "../game-room";
import { User } from "../user";
import { GameEventListener } from "./game-event-listener";
import { Hero } from "../hero/hero";
import { Player } from "../player";
import { AbilityHandler } from "../abilities/ability-handler";
import { AbilityEvent } from "../abilities/ability-event";

export class GameListener extends GameEventListener {
  eventHandlers: Handler[] = [
    {
      event: "heroPlayed",
      handler: this.heroPlayedHandler,
    },
    {
      event: "win",
      handler: this.winHandler,
    },
  ];

  userApi: UserApi;

  heroPlayedHandler(user: User, game: Game, gameObject: any[]) {
    const container = gameObject[0];
    const hero: Hero = gameObject[1];
    user.socket.to(game.gameRoom.name).emit("opponentHeroPlayed", { container: container, hero: hero });

    game.currentTurnPlayer.discardPile.push(hero);
    game.currentTurnPlayer.removeFromHand(hero);

    const abilityHandler = new AbilityHandler();
    const event: AbilityEvent = abilityHandler.execute(game.getCurrentNonPlayer(), hero);
    game.updatePlayer(event.player);
    var playerObj = game.getPlayerData(event.player);
    game.gameRoom.socket.emit(event.event, playerObj);
    game.increaseCurrentPlays();
  }

  winHandler(user: User, game: Game, args: any[]) {
    console.log("Got a winner!");

    // Add win to winners record
    this.userApi = new UserApi();

    // TODO: In eventual game class, store coins literal as const
    this.userApi.recordWin(user, 50);

    // Add loss for everyone else in the room
    for (let i = 0; i < game.gameRoom.users.length; i++) {
      const gameRoomUser = game.gameRoom.users[i];

      if (gameRoomUser === user) {
        continue;
      }
      // TODO: As above
      this.userApi.recordLoss(gameRoomUser, 5);
    }
  }
}
