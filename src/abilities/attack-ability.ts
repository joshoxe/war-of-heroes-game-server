import { Hero } from "../hero/hero";
import { Player } from "../player";
import { Ability } from "./ability";
import { AbilityEvent } from "./ability-event";

export class AttackAbility implements Ability {
    abilityEvent: string;

    execute(player: Player, hero: Hero): AbilityEvent {
        var newPlayer = player;
        newPlayer.health -= hero.ability.amount;

        if (newPlayer.health < 0) {
            newPlayer.health = 0;
        }

        return {event: "attackPlayed", player: newPlayer};
    }

}