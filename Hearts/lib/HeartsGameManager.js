"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HeartsGame_1 = require("./HeartsGame");
var HeartsGameManager = /** @class */ (function () {
    function HeartsGameManager() {
        this.players = [];
        this.game = new HeartsGame_1.HeartsGame();
    }
    HeartsGameManager.prototype.getStatus = function (num) {
        var hand = [];
        if (this.game.getHand(num)) {
            hand = this.game.getHand(num).cards;
        }
        return {
            num: num,
            playerNum: this.game.playerNum,
            leader: this.game.leader,
            currentPlayer: this.game.currentPlayer,
            hand: hand,
            handSizes: this.game.hands.map(function (x) { return x.getSize(); }),
            table: this.game.table.cards.map(function (x) { return x.card; })
        };
    };
    HeartsGameManager.prototype.broadcastStatus = function () {
        var _this = this;
        this.players.forEach(function (x) { return x.updateStatus(_this.getStatus(x.playerNum)); });
    };
    HeartsGameManager.prototype.addPlayer = function (pws) {
        var playerNum = this.game.addPlayer();
        pws.setPlayerNum(playerNum);
        this.players[playerNum] = pws;
        this.broadcastStatus();
        return playerNum;
    };
    HeartsGameManager.prototype.startGame = function () {
        this.game.deal();
        this.broadcastStatus();
    };
    HeartsGameManager.prototype.setHandaround = function (player, handaround) {
        var canBegin = this.game.setHandaround(player, handaround);
        console.log(canBegin);
        if (canBegin) {
            this.game.executeHandaround();
            this.broadcastStatus();
        }
    };
    HeartsGameManager.prototype.playCard = function (player, card) {
        var canEndTurn = this.game.playCard(player, card);
        if (canEndTurn) {
            var victor = this.game.getVictor();
            this.players.forEach(function (x) { return x.roundCompleteUpdate(victor); });
            var canEndGame = this.game.toNextTurn();
            if (canEndGame) {
                var scores = this.game.getPlayerScores();
                this.players.forEach(function (x) { return x.gameCompleteUpdate(scores); });
            }
        }
        this.broadcastStatus();
    };
    return HeartsGameManager;
}());
exports.HeartsGameManager = HeartsGameManager;
//# sourceMappingURL=HeartsGameManager.js.map