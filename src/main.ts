import { GameServer } from "./game-server";

const gameServer = new GameServer;
var port = process.env.PORT || 3000

gameServer.listen(port);
