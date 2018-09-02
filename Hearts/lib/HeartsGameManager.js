"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HeartsGame_1 = require("./HeartsGame");
class HeartsGameManager {
    constructor() {
        this.players = [];
        this.game = new HeartsGame_1.HeartsGame();
    }
    getStatus(num) {
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
            handSizes: this.game.hands.map(x => x.getSize()),
            table: this.game.table.cards.map(x => x.card),
            stage: this.game.stage
        };
    }
    broadcastStatus() {
        this.players.forEach(x => x.updateStatus(this.getStatus(x.playerNum)));
    }
    addPlayer(pws) {
        var playerNum = this.game.addPlayer();
        pws.setPlayerNum(playerNum);
        this.players[playerNum] = pws;
        this.broadcastStatus();
        return playerNum;
    }
    startGame() {
        this.game.deal();
        this.broadcastStatus();
    }
    setHandaround(player, handaround) {
        var canBegin = this.game.setHandaround(player, handaround);
        console.log(canBegin);
        if (canBegin) {
            this.game.executeHandaround();
            this.broadcastStatus();
        }
    }
    playCard(player, card) {
        var canEndTurn = this.game.playCard(player, card);
        if (canEndTurn) {
            var victor = this.game.getVictor();
            this.players.forEach(x => x.roundCompleteUpdate(victor));
            var canEndGame = this.game.toNextTurn();
            if (canEndGame) {
                var scores = this.game.getPlayerScores();
                this.players.forEach(x => x.gameCompleteUpdate(scores));
            }
        }
        this.broadcastStatus();
    }
}
exports.HeartsGameManager = HeartsGameManager;
//# sourceMappingURL=HeartsGameManager.js.map