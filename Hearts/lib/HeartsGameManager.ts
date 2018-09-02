import { HeartsGame } from "./HeartsGame";
import { PlayerWebSocket } from "./PlayerWebSocket";
import { Card } from "./Card";
import { PlayerStatus } from "./PlayerStatus";

export class HeartsGameManager {
    game: HeartsGame;
    players: PlayerWebSocket[] = [];

    constructor() {
        this.game = new HeartsGame();
    }

    getStatus(num): PlayerStatus {
        var hand = [];
        if (this.game.getHand(num)) {
            hand = this.game.getHand(num).cards
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
        }
    }

    broadcastStatus() {
        this.players.forEach(x => x.updateStatus(this.getStatus(x.playerNum)));
    }

    addPlayer(pws: PlayerWebSocket): number {
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

    setHandaround(player: number, handaround: Card[]) {
        var canBegin = this.game.setHandaround(player, handaround);
        console.log(canBegin);
        if (canBegin) {
            this.game.executeHandaround();
            this.broadcastStatus();
        }
    }

    playCard(player: number, card: Card) {
        var canEndTurn = this.game.playCard(player, card);
        if (canEndTurn) {
            setTimeout(() => {
                var victor = this.game.getVictor();
                console.log(victor)
                this.players.forEach(x => x.roundCompleteUpdate(victor));
                var canEndGame = this.game.toNextTurn();
                if (canEndGame) {
                    var scores = this.game.getPlayerScores();
                    this.players.forEach(x => x.gameCompleteUpdate(scores));
                }
                this.broadcastStatus();
            }, 1500);
        }
        this.broadcastStatus();
    }
}