"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Table {
    constructor() {
        this.cards = [];
    }
    reset() {
        this.cards = [];
        this.hasBeenLead = false;
    }
    add(player, card) {
        this.cards.push({
            player: player,
            card: card
        });
        if (!this.hasBeenLead) {
            this.hasBeenLead = true;
            this.leadSuit = card.suit;
        }
    }
    getCards() {
        return this.cards.map(x => { return x.card; });
    }
    getVictor() {
        var cardsOfSuit = this.cards.filter(x => { return x.card.suit == this.leadSuit; });
        console.log(cardsOfSuit);
        console.log(this.cards);
        var sortedCardsOfSuit = cardsOfSuit.sort((a, b) => { return b.card.score - a.card.score; });
        return sortedCardsOfSuit[0].player;
    }
}
exports.Table = Table;
//# sourceMappingURL=Table.js.map