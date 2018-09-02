"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WonCardsArray {
    constructor() {
        this.cards = [];
    }
    add(card) {
        this.cards.push(card);
    }
    addMany(newCards) {
        this.cards = this.cards.concat(newCards);
    }
    calcScore() {
        var score = 0;
        this.cards.forEach((c) => {
            score += c.getPoints();
        });
        return score;
    }
}
exports.WonCardsArray = WonCardsArray;
//# sourceMappingURL=WonCardsArray.js.map