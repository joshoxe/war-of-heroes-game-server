import axios from "axios";
import * as https from 'https';
import { Hero } from "../hero";
import { User } from "../user";

export class HeroApi {
    heroApiUrl: string = "https://localhost:44398";

    async getHeroes(user: User, deck: number[]): Promise<Hero[]> {
        const headers = {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${user.jwtToken}`,
            'AccessToken': user.accessToken
        }
        const heroEndpoint = '/hero/ids'
        var deckHeroes: Hero[];

        await axios.post(this.heroApiUrl + heroEndpoint, {"heroIds": deck},
            {
                headers: headers,
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                  })
            })
            .then((heroes) => {
                deckHeroes = heroes.data;
            }) 
            .catch((error) => {
                console.log("Unable to get heroes:", error);
            })

        return deckHeroes;
    }
}