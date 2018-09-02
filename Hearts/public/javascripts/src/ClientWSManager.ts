import { Card } from "./Card";
import { setPanel } from ".";


export interface GameStatus  {
    hand: Card[],
    table: Card[],
    num: number
}

var stageconst = {
    STAGE_INITIAL: 0,
    STAGE_HANDAROUND: 1,
    STAGE_PLAYING_CARDS: 2,
    STAGE_ENDING_TURN: 3,
    STAGE_ENDING_GAME: 4
}


export class ClientWSManager {

    static PROTOCOL_NEWGAME = 0;
    static PROTOCOL_JOINGAME = 1;
    static PROTOCOL_STARTGAME = 2;
    static PROTOCOL_SETHANDAROUND = 3;
    static PROTOCOL_PLAYCARD = 4;

    static PROTOCOL_INDIVIDUAL_UPDATE = 50;

    static PROTOCOL_BROADCAST_UPDATE = 100;
    static PROTOCOL_BROADCAST_ROUNDCOMPLETE = 101;
    static PROTOCOL_BROADCAST_GAMECOMPLETE = 102;

    gameStatus: GameStatus;
    ws: WebSocket;
    stage: number;
    handarounds: Card[] = [];
    constructor() {
        this.ws = new WebSocket("ws://" + window.location.hostname + ":3030");
        this.ws.onmessage = this.onMessage.bind(this);
        this.gameStatus = {
            hand: [],
            table: [],
            num: null
        };
        
    }

    onMessage(msg) {
        var json:any
        try {
            json = JSON.parse(msg.data);
        } catch (e) {
            json = { "type": -1 };
        }
        console.log(json);
        switch (json.type) {
            case ClientWSManager.PROTOCOL_INDIVIDUAL_UPDATE:
            case ClientWSManager.PROTOCOL_BROADCAST_UPDATE:
                this.gameStatus.num = json.status.num;
                this.stage = json.status.stage;
                if (this.stage != stageconst.STAGE_INITIAL && this.stage != stageconst.STAGE_ENDING_GAME) {
                    setPanel($("#panel_game"))
                    if (this.stage != stageconst.STAGE_HANDAROUND) {
                        $("#handarounds").hide();
                        $("#table").show();
                    } else {
                        $("#table").hide();
                    }
                }
                this.gameStatus.hand = json.status.hand.map(x => new Card(x.num, x.suitn));
                this.gameStatus.table = json.status.table.map(x => new Card(x.num, x.suitn));

                this.updateHand();

                var tableString = "";
                this.gameStatus.table.forEach(x => tableString += x.unicode);
                $("#table_cards").text(tableString);
                if (json.status.num == json.status.currentPlayer) {
                    $("#table_yourturn").show();
                } else {
                    $("#table_yourturn").hide();
                }

                break;
            case ClientWSManager.PROTOCOL_NEWGAME:
            case ClientWSManager.PROTOCOL_JOINGAME:
                setPanel($("#panel_awaiting"))
                $("#game_id").text(json.id);
                break;
            case ClientWSManager.PROTOCOL_STARTGAME:
                setPanel($("#panel_game"))
                break;
            case ClientWSManager.PROTOCOL_BROADCAST_ROUNDCOMPLETE:
                if (json.victor == this.gameStatus.num) {
                    this.winRound();
                }
                break;
            case ClientWSManager.PROTOCOL_BROADCAST_GAMECOMPLETE:
                for (var i = 0; i < json.playerScores.length; i++) {
                    var pscore = json.playerScores[i];
                    var row = $("<tr>")
                        .append($("<td>").text(i + 1))
                        .append($("<td>").text(pscore.player))
                        .append($("<td>").text(pscore.score))
                    if (pscore.player == this.gameStatus.num) {
                        row.addClass("won");
                    }
                    $("#scoreboard").append(row);
                }
                setPanel($("#panel_scores"))
                break;
        }
    }

    newGame() {
        this.ws.send(JSON.stringify({
            type: ClientWSManager.PROTOCOL_NEWGAME
        }))
    }

    joinGame(id) {
        this.ws.send(JSON.stringify({
            type: ClientWSManager.PROTOCOL_JOINGAME,
            id: id 
        }))
    }

    startGame() {
        this.ws.send(JSON.stringify({
            type: ClientWSManager.PROTOCOL_STARTGAME
        }))
    }

    removeHandaround(card: Card) {
        this.handarounds = this.handarounds.filter(x => !x.matches(card));

        this.gameStatus.hand.push(card);
        this.updateHandarounds();
        this.updateHand();
    }

    addHandaround(card: Card) {
        if (this.handarounds.length <= 2) {
            this.handarounds.push(card);
            this.gameStatus.hand = this.gameStatus.hand.filter(x => !x.matches(card));
            this.updateHandarounds();
            this.updateHand();
        }
    }

    updateHand() {
        var handCardsElem = $("#hand_cards").empty();

        this.gameStatus.hand.forEach(x => {
            var card = $("<span></span>");
            card.text(x.unicode);
            card.click(function () {
                if (this.stage == stageconst.STAGE_HANDAROUND) {
                    this.addHandaround(x);
                } else if (this.stage == stageconst.STAGE_PLAYING_CARDS) {
                    this.playCard(x);
                }
            }.bind(this))
            handCardsElem.append(card);
        });
    }

    updateHandarounds() {
        var handaroundCardsElem = $("#handaround_cards").empty();
        for (var i = 0; i < this.handarounds.length; i++) {
            var card = this.handarounds[i];
            var cardElem = $("<span></span>");
            cardElem.text(card.unicode);
            cardElem.click(function () {
                if (this.stage == stageconst.STAGE_HANDAROUND) {
                    this.removeHandaround(card);
                }
            }.bind(this))
            handaroundCardsElem.append(cardElem);
        }

        if (this.handarounds.length == 3) {
            $("#handaround_button").show();
        } else {
            $("#handaround_button").hide();
        }
    }

    setHandaround() {
        this.ws.send(JSON.stringify({
            type: 3,
            cards: this.handarounds
        }));
    }

    playCard(card) {
        this.ws.send(JSON.stringify({
            type: 4,
            card: card
        }));
    }

    winRound() {
        $("#owned_cards").append("🂠");
    }
}