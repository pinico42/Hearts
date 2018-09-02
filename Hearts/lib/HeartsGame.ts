import { Pack } from "./Pack";
import { Hand } from "./Hand";
import { Card } from "./Card";
import { Table } from "./Table";
import { WonCardsArray } from "./WonCardsArray";

export interface PlayerScore {
    player: number;
    score: number;
}

export class HeartsGame {
    pack: Pack;
    playerNum: number;
    hands: Hand[] = [];
    rejects: Card[] = [];
    handarounds: Card[][] = [];

    currentPlayer: number;
    leader: number;
    table: Table = new Table();

    wonCards: WonCardsArray[] = [];

    static STAGE_INITIAL = 0;
    static STAGE_HANDAROUND = 1;
    static STAGE_PLAYING_CARDS = 2;
    static STAGE_ENDING_TURN = 3;
    static STAGE_ENDING_GAME = 4;
    stage: number = HeartsGame.STAGE_INITIAL;
    

    constructor() {
        this.pack = new Pack();
        this.playerNum = 0;
    }

    addPlayer(): number {
        if (this.stage == HeartsGame.STAGE_INITIAL) {
            var pnum =  this.playerNum;
            this.playerNum++;
            this.handarounds.push([]);
            this.wonCards.push(new WonCardsArray());
            return pnum
        } else {
            throw new Error("Game must be in stage STAGE_INITIAL");
        }
    }

    deal() {
        if (this.stage == HeartsGame.STAGE_INITIAL) {
            this.stage = HeartsGame.STAGE_HANDAROUND;
            this.pack.shuffle();
            this.hands = this.pack.deal(this.playerNum);
            this.hands.forEach(h => { h.sort() });
            this.rejects = this.pack.getRejects(this.playerNum);

            this.leader = Math.floor(Math.random() * this.playerNum);
            this.currentPlayer = this.leader;
        } else {
            throw new Error("Game must be in stage STAGE_INITIAL");
        }
    }

    getHand(player) {
        return this.hands[player];
    }

    setHandaround(player: number, handaround: Card[]): boolean {
        if (this.stage == HeartsGame.STAGE_HANDAROUND) {
            if (handaround.length != 3) {
                throw new Error("Only 3 handarounds allowed");
            }
            this.handarounds[player] = handaround;
            for (var i = 0; i < 3; i++) {
                this.hands[player].remove(handaround[i]);
            }
            return this.handarounds.filter(x => x.length == 0 || x == undefined).length == 0;
        } else {
            throw new Error("Game must be in stage STAGE_HANDAROUND");
        }
    }

    executeHandaround() {
        if (this.stage == HeartsGame.STAGE_HANDAROUND) {
            for (var i = 0; i < this.playerNum; i++) {
                var handaround = this.handarounds[i];
                var newPlayer = (i + this.playerNum - 1) % this.playerNum;
                console.log(i + " => " + newPlayer);
                this.hands[newPlayer].pushMany(handaround);
                this.hands[newPlayer].sort();
            }
            this.stage = HeartsGame.STAGE_PLAYING_CARDS;
        } else {
            throw new Error("Game must be in stage STAGE_HANDAROUND");
        }
    }

    playCard(player: number, card: Card): boolean {
        if (this.stage != HeartsGame.STAGE_PLAYING_CARDS) {
            throw new Error("Game must be in stage STAGE_PLAYING_CARDS");
        }
        if (this.currentPlayer != player) {
            throw new Error("Player cannot play outside turn");
        }
        this.hands[player].remove(card);
        this.table.add(player, card);
        this.currentPlayer = (this.currentPlayer + 1) % this.playerNum;
        if (this.currentPlayer == this.leader) {
            this.stage = HeartsGame.STAGE_ENDING_TURN;
            return true;
        }
    }

    getVictor(): number {
        if (this.stage != HeartsGame.STAGE_ENDING_TURN) {
            throw new Error("Game must be in stage STAGE_ENDING_TURN");
        }
        var victor = this.table.getVictor();
        this.wonCards[victor].addMany(this.table.getCards());
        this.leader = victor;

        return victor;
    }

    toNextTurn(): boolean {
        if (this.stage != HeartsGame.STAGE_ENDING_TURN) {
            throw new Error("Game must be in stage STAGE_ENDING_TURN");
        }
        if (this.hands[0].cards.length == 0) {
            this.stage = HeartsGame.STAGE_ENDING_GAME;
            return true;
        }
        this.stage = HeartsGame.STAGE_PLAYING_CARDS;
        this.currentPlayer = this.leader;
        this.table = new Table();
        return false;
    }

    getPlayerScores(): PlayerScore[] {
        if (this.stage != HeartsGame.STAGE_ENDING_GAME) {
            throw new Error("Game must be in stage STAGE_ENDING_GAME");
        }

        var playerPoints: PlayerScore[] = [];
        for (var i = 0; i < this.playerNum; i++) {
            var wca = this.wonCards[i];
            playerPoints.push({
                player: i,
                score: wca.calcScore()
            });
        }
        playerPoints.sort((a, b): number => {
            return a.score - b.score;
        })

        return playerPoints;
    }
}