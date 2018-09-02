
export class Card {
    numsimple: number;
    score: number;
    rank: string;
    suit: string;
    face: string;
    unicode: string;

    constructor(public num: number, public suitn: number) { // 0: Spades, 1: Hearts, 2: Diamonds, 3: Clubs; 0: Ace, 1: Two...
        this.numsimple = (num + 12) % 13 + 2;
        this.score = (num + 12) % 13;
        this.rank = (this.numsimple <= 10) ? (this.numsimple).toString() : ["J", "Q", "K", "A"][this.numsimple - 11];
        this.suit = ["S", "H", "D", "C"][this.suitn];
        this.face = this.rank + this.suit;
        var numforunicode = (this.num <= 10) ? this.num : this.num + 1
        this.unicode = String.fromCharCode(55356, 56481 + numforunicode + this.suitn * 16);
    }

    static fromFace(face: string) {
        var rank = face[face.length - 2];
        var suit = face[face.length - 1];
        var num = "A234567890JQK".indexOf(rank);
        console.log(num);
        var suitn = "SHDC".indexOf(suit);
        return new Card(num, suitn);
    }

    getPoints(): number {
        var literalPoints = (this.numsimple <= 10) ? this.numsimple : 10;
        var acutalHearts = (this.suitn == 1) ? literalPoints : 0;
        var queenTrumpPoints = (this.face == "QS") ? 15 : 0;
        return acutalHearts + queenTrumpPoints;
    }

    toString() {
        return "Card<" + this.face + ">";
    }

    matches(c: Card) {
        return (c.num == this.num && c.suitn == this.suitn);
    }
}
