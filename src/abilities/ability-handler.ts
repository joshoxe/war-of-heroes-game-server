import { Ability } from "./ability";
import { Hero } from "../hero/hero";
import { AttackAbility } from "./attack-ability";
import { Player } from "../player";
import { AbilityEvent } from "./ability-event";

export class AbilityHandler {
    public execute(player: Player, hero: Hero): AbilityEvent {
        var ability: Ability;

        switch(hero.ability.type) {
            case "Attack":
                ability = new AttackAbility();
                break;
        }

        return ability.execute(player, hero);
    }
}