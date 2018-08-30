var ws = new WebSocket("ws://localhost:3030");
var num = 0;

var cardNames = [];

ws.onmessage = function (msg) {
    var json = JSON.parse(msg.data);
    console.log(json);
    if (json.type === 100 || json.type === 50) {
        var cardstring = "";
        cardNames = [];
        json.status.hand.forEach(x => { cardstring += x.unicode; cardNames.push(x.face); });
        console.log(cardstring);
        document.getElementById('cards').innerHTML = cardstring;

        num = json.status.num;

        if (json.status.num == json.status.currentPlayer) {
            document.getElementById('message').innerHTML = "your move"
        } else {
            document.getElementById('message').innerHTML = ""
        }

        var tablestring = "";
        json.status.table.forEach(x => tablestring += x.unicode);
        document.getElementById('table').innerHTML = tablestring;
    }

    if (json.type === 101) {
        if (num == json.victor) {
            alert("You win");

        }
    }
}

function newGame() {
    ws.send('{"type":0}');
}

function joinGame() {
    var game = prompt("game id");
    ws.send('{"type":1, "id":"'+game+'"}');
}

function startGame() {
    ws.send('{"type":2}');
}

function setHandaround() {
    var c1 = Card.fromFace(prompt("card1")).toElementary();
    var c2 = Card.fromFace(prompt("card2")).toElementary();
    var c3 = Card.fromFace(prompt("card3")).toElementary();
    ws.send(JSON.stringify({
        type: 3,
        cards: [c1, c2, c3]
    }));
}

function setHandaroundThree() {
    ws.send(JSON.stringify({
        type: 3,
        cards: cardNames.slice(0, 3).map(x => Card.fromFace(x).toElementary())
    }));
}

function playCard() {
    var c = Card.fromFace(prompt("card")).toElementary();
    ws.send(JSON.stringify({
        type: 4,
        card: c
    }));
}

function playFirstCard() {
    var c = Card.fromFace(cardNames[0]).toElementary();
    ws.send(JSON.stringify({
        type: 4,
        card: c
    }));

}

function requestUpdate() {
    ws.send('{"type":50}');
}

class Card {

    constructor(num, suitn) { // 0: Spades, 1: Hearts, 2: Diamonds, 3: Clubs; 0: Ace, 1: Two...
        this.num = num;
        this.suitn = suitn;
        this.numsimple = (num + 12) % 13 + 2;
        this.score = (num + 12) % 13;
        this.rank = (this.numsimple <= 10) ? (this.numsimple).toString() : ["J", "Q", "K", "A"][this.numsimple - 11];
        this.suit = ["S", "H", "D", "C"][this.suitn];
        this.face = this.rank + this.suit;
        var numforunicode = (this.numsimple <= 11) ? this.numsimple : this.numsimple + 1
        this.unicode = String.fromCharCode(55356, 56481 + numforunicode + this.suitn * 16);
    }

    toElementary() {
        return {
            num: this.num,
            suitn: this.suitn
        }
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
        return (this.numsimple <= 10) ? this.numsimple : 10;
    }

    toString() {
        return "Card<" + this.face + ">";
    }
}