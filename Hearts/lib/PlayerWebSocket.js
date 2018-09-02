"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HeartsWSServer_1 = require("./HeartsWSServer");
class PlayerWebSocket {
    constructor(ws, properties) {
        this.ws = ws;
        this.properties = properties;
    }
    setId(id) {
        this.properties.id = id;
    }
    setPlayerNum(playerNum) {
        this.playerNum = playerNum;
        this.properties.num = playerNum;
    }
    updateStatus(status) {
        this.ws.send(JSON.stringify({
            type: HeartsWSServer_1.HeartsWSServer.PROTOCOL_BROADCAST_UPDATE,
            status: status
        }));
    }
    roundCompleteUpdate(victor) {
        this.ws.send(JSON.stringify({
            type: HeartsWSServer_1.HeartsWSServer.PROTOCOL_BROADCAST_ROUNDCOMPLETE,
            victor: victor
        }));
    }
    gameCompleteUpdate(playerScores) {
        this.ws.send(JSON.stringify({
            type: HeartsWSServer_1.HeartsWSServer.PROTOCOL_BROADCAST_GAMECOMPLETE,
            playerScores: playerScores
        }));
    }
}
exports.PlayerWebSocket = PlayerWebSocket;
//# sourceMappingURL=PlayerWebSocket.js.map