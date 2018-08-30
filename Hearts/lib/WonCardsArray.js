"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WonCardsArray = /** @class */ (function () {
    function WonCardsArray() {
        this.cards = [];
    }
    WonCardsArray.prototype.add = function (card) {
        this.cards.push(card);
    };
    WonCardsArray.prototype.addMany = function (newCards) {
        this.cards = this.cards.concat(newCards);
    };
    WonCardsArray.prototype.calcScore = function () {
        var score = 0;
        this.cards.forEach(function (c) {
            score += c.getPoints();
        });
        return score;
    };
    return WonCardsArray;
}());
exports.WonCardsArray = WonCardsArray;
//# sourceMappingURL=WonCardsArray.js.map