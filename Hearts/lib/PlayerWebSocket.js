"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HeartsWSServer_1 = require("./HeartsWSServer");
var PlayerWebSocket = /** @class */ (function () {
    function PlayerWebSocket(ws) {
        this.ws = ws;
    }
    PlayerWebSocket.prototype.setId = function (id) {
        this.ws.id = id;
    };
    PlayerWebSocket.prototype.setPlayerNum = function (playerNum) {
        this.playerNum = playerNum;
        this.ws.num = playerNum;
    };
    PlayerWebSocket.prototype.updateStatus = function (status) {
        this.ws.send(JSON.stringify({
            type: HeartsWSServer_1.HeartsWSServer.PROTOCOL_BROADCAST_UPDATE,
            status: status
        }));
    };
    PlayerWebSocket.prototype.roundCompleteUpdate = function (victor) {
        this.ws.send(JSON.stringify({
            type: HeartsWSServer_1.HeartsWSServer.PROTOCOL_BROADCAST_ROUNDCOMPLETE,
            victor: victor
        }));
    };
    PlayerWebSocket.prototype.gameCompleteUpdate = function (playerScores) {
        this.ws.send(JSON.stringify({
            type: HeartsWSServer_1.HeartsWSServer.PROTOCOL_BROADCAST_GAMECOMPLETE,
            playerScores: playerScores
        }));
    };
    return PlayerWebSocket;
}());
exports.PlayerWebSocket = PlayerWebSocket;
//# sourceMappingURL=PlayerWebSocket.js.map