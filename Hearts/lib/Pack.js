"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Card_1 = require("./Card");
var Hand_1 = require("./Hand");
var Pack = /** @class */ (function () {
    function Pack() {
        this.cards = [];
        /*for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 4; j++) {
                this.cards.push(new Card(i, j))
            }
        }*/
        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 1; j++) {
                this.cards.push(new Card_1.Card(i, j));
            }
        }
    }
    Pack.prototype.shuffle = function () {
        for (var i = this.cards.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [this.cards[j], this.cards[i]], this.cards[i] = _a[0], this.cards[j] = _a[1];
        }
        var _a;
    };
    Pack.prototype.deal = function (players) {
        var rejects = this.getRejects(players);
        var hands = new Array(players);
        for (var i = 0; i < players; i++) {
            hands[i] = new Hand_1.Hand();
        }
        var currentPlayer = 0;
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            if (rejects.filter(function (x) { return x.matches(card); }).length == 0) {
                hands[currentPlayer].push(card);
                currentPlayer = (currentPlayer + 1) % players;
            }
        }
        return hands;
    };
    Pack.prototype.getRejects = function (players) {
        var rejectnum = 52 % players;
        var rejects = [
            Card_1.Card.fromFace("2C"),
            Card_1.Card.fromFace("2D"),
            Card_1.Card.fromFace("2S")
        ].slice(0, rejectnum);
        return rejects;
    };
    return Pack;
}());
exports.Pack = Pack;
if (require.main === module) {
    var p = new Pack();
    p.shuffle();
    var d = p.deal(5);
    d[0].sort();
    d.forEach(function (h) {
        h.cards.forEach(function (c) {
            console.log(c.face);
        });
        console.log(h.cards.length);
        console.log("");
    });
}
//# sourceMappingURL=Pack.js.map