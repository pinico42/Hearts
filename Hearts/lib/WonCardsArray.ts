import { Card } from "./Card";

export class WonCardsArray {
    cards: Card[] = [];
    add(card: Card) {
        this.cards.push(card);
    }

    addMany(newCards: Card[]) {
        this.cards = this.cards.concat(newCards);
    }

    calcScore(): number {
        var score = 0;
        this.cards.forEach((c) => {
            score += c.getPoints();
        })
        return score;
    }
}