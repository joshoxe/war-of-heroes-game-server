import { Ability } from "./ability";

export interface Hero {
    id: number;
    name: string;
    ability: Ability;
    description: string;
}