import axios from "axios";
require("ssl-root-cas").inject();
import * as https from "https";
import { User } from "../user";

export class UserApi {
  userApiUrl: string = "https://warofheroesusers.azurewebsites.net";

  recordWin(user: User, coinsForWin: number) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.jwtToken}`,
      AccessToken: user.accessToken,
    };
    const winEndpoint = `/user/${user.id}/win`;

    axios
      .put(this.userApiUrl + winEndpoint, `${coinsForWin}`, {
        headers: headers,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .catch((error) => {
        console.log("Unable to record win:", error);
      });
  }

  recordLoss(user: User, coinsForLoss: number) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.jwtToken}`,
      AccessToken: user.accessToken,
    };
    const lossEndpoint = `/user/${user.id}/loss`;

    axios
      .put(this.userApiUrl + lossEndpoint, `${coinsForLoss}`, {
        headers: headers,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .catch((error) => {
        console.log("Unable to record loss:", error);
      });
  }
}
