import { Socket } from "socket.io";
import { Hero } from "./hero";

export class Player {
  name: string;
  health: number = 100;
  inventoryIds: number[];
  inventory: Hero[];
  discardPile: Hero[] = [];
  currentHand: Hero[] =[];
  socket: Socket;

  constructor(name: string, inventory: Hero[], socket: Socket) {
    this.name = name;
    this.inventory = inventory;
    this.socket = socket;
  }

  drawNewHand(): Hero[] {
    if (this.inventory.length < 5 && this.discardPile.length > 0) {
      return;
    }
    
    if (this.currentHand.length > 0) {
        return;
    }

    var newHand: Hero[] = [];

    const handSize = 5;
    for (let i = 0; i <= handSize; i++) {
        const randomHeroIndex = Math.floor(Math.random() * this.inventory.length);
        newHand.push(this.inventory[randomHeroIndex]);
        this.removeFromInventory(randomHeroIndex);
   }

   this.currentHand = newHand;
   return this.currentHand;
  }

  removeFromInventory(index: number) {
    if (index > -1) {
      this.inventory.splice(index, 1);
    }
  }

  refreshInventory(): Hero[] {
      var newInventory = this.inventory.concat(this.discardPile);
      var shuffledInventory = this.shuffle(newInventory);
      return shuffledInventory;
  }

  shuffle(heroes: Hero[]) {
    var currentIndex = heroes.length
    var randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [heroes[currentIndex], heroes[randomIndex]] = [
        heroes[randomIndex],
        heroes[currentIndex],
      ];
    }

    return heroes;
  }
}