import { Hero } from "../hero/hero";
import { Player } from "../player";
import { AbilityEvent } from "./ability-event";

export interface Ability {
    abilityEvent: string;

    execute(player: Player, hero: Hero): AbilityEvent;
}