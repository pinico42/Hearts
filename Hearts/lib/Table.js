"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Table = /** @class */ (function () {
    function Table() {
        this.cards = [];
    }
    Table.prototype.reset = function () {
        this.cards = [];
        this.hasBeenLead = false;
    };
    Table.prototype.add = function (player, card) {
        this.cards.push({
            player: player,
            card: card
        });
        if (!this.hasBeenLead) {
            this.hasBeenLead = true;
            this.leadSuit = card.suit;
        }
    };
    Table.prototype.getCards = function () {
        return this.cards.map(function (x) { return x.card; });
    };
    Table.prototype.getVictor = function () {
        var _this = this;
        var cardsOfSuit = this.cards.filter(function (x) { return x.card.suit == _this.leadSuit; });
        console.log(cardsOfSuit);
        console.log(this.cards);
        var sortedCardsOfSuit = cardsOfSuit.sort(function (a, b) { return b.card.score - a.card.score; });
        return sortedCardsOfSuit[0].player;
    };
    return Table;
}());
exports.Table = Table;
//# sourceMappingURL=Table.js.map