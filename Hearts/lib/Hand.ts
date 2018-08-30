import { Card } from "./Card";

export class Hand {
    constructor(public cards: Card[] = []) { }

    getSize(): number {
        return this.cards.length;
    }

    push(card: Card) {
        this.cards.push(card);
    }

    pushMany(cards: Card[]) {
        cards.forEach(x => this.push(x));
    }

    remove(card: Card) {
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
    }

    sort() {
        this.cards.sort((a, b): number => {
            var suitdiff = a.suitn - b.suitn;
            return suitdiff + ((suitdiff == 0) ? (a.score - b.score) : 0);
        })
    }

    toString() {
        var stringcards = "";
        for (var i in this.cards) {
            stringcards = stringcards + this.cards[i] + "\n";
        }
        console.log("Hand<" + stringcards + ">");
    }
}