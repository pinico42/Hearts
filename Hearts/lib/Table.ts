import { Card } from "./Card";

interface PlayerCard {
    player: number,
    card: Card
}

export class Table {
    cards: PlayerCard[] = [];
    leadSuit: string;
    hasBeenLead: boolean;
    reset() {
        this.cards = [];
        this.hasBeenLead = false;
    }

    add(player: number, card: Card) {
        this.cards.push({
            player: player,
            card: card
        });
        if (!this.hasBeenLead) {
            this.hasBeenLead = true;
            this.leadSuit = card.suit;
        }
    }

    getCards(): Card[] {
        return this.cards.map(x => { return x.card });
    }

    getVictor(): number {
        var cardsOfSuit = this.cards.filter(x => { return x.card.suit == this.leadSuit; })
        console.log(cardsOfSuit);
        console.log(this.cards);
        var sortedCardsOfSuit = cardsOfSuit.sort((a, b): number => { return b.card.score - a.card.score });
        return sortedCardsOfSuit[0].player;
    }
}