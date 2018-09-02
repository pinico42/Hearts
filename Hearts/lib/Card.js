"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Card {
    constructor(num, suitn) {
        this.num = num;
        this.suitn = suitn;
        this.numsimple = (num + 12) % 13 + 2;
        this.score = (num + 12) % 13;
        this.rank = (this.numsimple <= 10) ? (this.numsimple).toString() : ["J", "Q", "K", "A"][this.numsimple - 11];
        this.suit = ["S", "H", "D", "C"][this.suitn];
        this.face = this.rank + this.suit;
        var numforunicode = (this.num <= 10) ? this.num : this.num + 1;
        this.unicode = String.fromCharCode(55356, 56481 + numforunicode + this.suitn * 16);
    }
    static fromFace(face) {
        var rank = face[face.length - 2];
        var suit = face[face.length - 1];
        var num = "A234567890JQK".indexOf(rank);
        console.log(num);
        var suitn = "SHDC".indexOf(suit);
        return new Card(num, suitn);
    }
    getPoints() {
        var literalPoints = (this.numsimple <= 10) ? this.numsimple : 10;
        var acutalHearts = (this.suitn == 1) ? literalPoints : 0;
        var queenTrumpPoints = (this.face == "QS") ? 15 : 0;
        return acutalHearts + queenTrumpPoints;
    }
    toString() {
        return "Card<" + this.face + ">";
    }
    matches(c) {
        return (c.num == this.num && c.suitn == this.suitn);
    }
}
exports.Card = Card;
if (require.main === module) {
    console.log(Card.fromFace("QH"));
}
//# sourceMappingURL=Card.js.map