"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Hand = /** @class */ (function () {
    function Hand(cards) {
        if (cards === void 0) { cards = []; }
        this.cards = cards;
    }
    Hand.prototype.getSize = function () {
        return this.cards.length;
    };
    Hand.prototype.push = function (card) {
        this.cards.push(card);
    };
    Hand.prototype.pushMany = function (cards) {
        var _this = this;
        cards.forEach(function (x) { return _this.push(x); });
    };
    Hand.prototype.remove = function (card) {
        var cardIndex = -1;
        for (var i = 0; i < this.cards.length; i++) {
            var c = this.cards[i];
            if (c.num == card.num && c.suitn == card.suitn) {
                cardIndex = i;
            }
        }
        if (cardIndex == -1) {
            throw new Error("Card not in hand");
        }
        this.cards.splice(cardIndex, 1);
    };
    Hand.prototype.sort = function () {
        this.cards.sort(function (a, b) {
            var suitdiff = a.suitn - b.suitn;
            return suitdiff + ((suitdiff == 0) ? (a.score - b.score) : 0);
        });
    };
    Hand.prototype.toString = function () {
        var stringcards = "";
        for (var i in this.cards) {
            stringcards = stringcards + this.cards[i] + "\n";
        }
        console.log("Hand<" + stringcards + ">");
    };
    return Hand;
}());
exports.Hand = Hand;
//# sourceMappingURL=Hand.js.map