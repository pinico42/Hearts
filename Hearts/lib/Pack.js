"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = require("./Card");
const Hand_1 = require("./Hand");
class Pack {
    constructor() {
        this.cards = [];
        for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 4; j++) {
                this.cards.push(new Card_1.Card(i, j));
            }
        }
        /*for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 1; j++) {
                this.cards.push(new Card(i, j))
            }
        }*/
    }
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    deal(players) {
        var rejects = this.getRejects(players);
        var hands = new Array(players);
        for (var i = 0; i < players; i++) {
            hands[i] = new Hand_1.Hand();
        }
        var currentPlayer = 0;
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            if (rejects.filter(x => x.matches(card)).length == 0) {
                hands[currentPlayer].push(card);
                currentPlayer = (currentPlayer + 1) % players;
            }
        }
        return hands;
    }
    getRejects(players) {
        var rejectnum = 52 % players;
        var rejects = [
            Card_1.Card.fromFace("2C"),
            Card_1.Card.fromFace("2D"),
            Card_1.Card.fromFace("2S")
        ].slice(0, rejectnum);
        return rejects;
    }
}
exports.Pack = Pack;
if (require.main === module) {
    var p = new Pack();
    p.shuffle();
    var d = p.deal(5);
    d[0].sort();
    d.forEach(h => {
        h.cards.forEach(c => {
            console.log(c.face);
        });
        console.log(h.cards.length);
        console.log("");
    });
}
//# sourceMappingURL=Pack.js.map