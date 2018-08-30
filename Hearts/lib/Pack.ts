import { Card } from "./Card";
import { Hand } from "./Hand";

export class Pack {
    public cards: Card[];

    constructor() {
        this.cards = [];
        /*for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 4; j++) {
                this.cards.push(new Card(i, j))
            }
        }*/
        for (var i = 0; i < 12; i++) {
            for (var j = 0; j < 1; j++) {
                this.cards.push(new Card(i, j))
            }
        }
    }

    shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal(players: number): Hand[] {
        var rejects = this.getRejects(players);
        var hands: Hand[] = new Array(players);
        for (var i = 0; i < players; i++) {
            hands[i] = new Hand();
        }

        var currentPlayer = 0;
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            if (rejects.filter(x=>x.matches(card)).length == 0) {
                hands[currentPlayer].push(card);
                currentPlayer = (currentPlayer + 1) % players;
            }
        }
        return hands;
    }

    getRejects(players: number): Card[] {
        var rejectnum = 52 % players;
        var rejects = [
            Card.fromFace("2C"),
            Card.fromFace("2D"),
            Card.fromFace("2S")
        ].slice(0, rejectnum);
        return rejects;
    }
}

if (require.main === module) {
    var p = new Pack();
    p.shuffle();
    var d = p.deal(5);
    d[0].sort();
    d.forEach(h => {
        h.cards.forEach(c => {
            console.log(c.face);
        })
        console.log(h.cards.length)
        console.log("")
    })
}