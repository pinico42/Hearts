"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws");
var HeartsGameManager_1 = require("./HeartsGameManager");
var PlayerWebSocket_1 = require("./PlayerWebSocket");
var Card_1 = require("./Card");
var HeartsWSServer = /** @class */ (function () {
    function HeartsWSServer(port) {
        if (port === void 0) { port = 8001; }
        this.port = port;
        this.games = {};
        console.log("Binding WSS to port " + port);
        this.wss = new WebSocket.Server({ port: port });
        this.wss.on('connection', this.onConnect.bind(this));
    }
    HeartsWSServer.prototype.genId = function () {
        var currentIds = Object.keys(this.games);
        var nid = Math.floor(Math.random() * 65535) - 32767;
        var sid = ('0000' + ((nid + 32767).toString(16))).slice(-4);
        if (currentIds.indexOf(sid) == -1) {
            return sid;
        }
        else {
            return this.genId();
        }
    };
    HeartsWSServer.prototype.onConnect = function (ws) {
        var _this = this;
        console.log("New connection");
        ws.on('message', function (msg) {
            _this.onMessage.bind(_this)(ws, msg);
        });
    };
    HeartsWSServer.prototype.onMessage = function (ws, msg) {
        try {
            var json = JSON.parse(msg);
        }
        catch (e) {
            ws.send(JSON.stringify({
                "errcode": 1,
                "message": "Invalid Syntax"
            }));
            var json = { type: -1 };
        }
        try {
            switch (json.type) {
                case HeartsWSServer.PROTOCOL_NEWGAME:
                    var id = this.genId();
                    this.games[id] = new HeartsGameManager_1.HeartsGameManager();
                    var pws = new PlayerWebSocket_1.PlayerWebSocket(ws);
                    pws.setId(id);
                    var num = this.games[id].addPlayer(pws);
                    ws.send(JSON.stringify({
                        type: HeartsWSServer.PROTOCOL_NEWGAME,
                        num: num,
                        id: id,
                    }));
                    break;
                case HeartsWSServer.PROTOCOL_JOINGAME:
                    var id = json.id;
                    var game = this.games[id];
                    if (!game) {
                        ws.send(JSON.stringify({
                            type: HeartsWSServer.PROTOCOL_JOINGAME,
                            success: false
                        }));
                        break;
                    }
                    var pws = new PlayerWebSocket_1.PlayerWebSocket(ws);
                    pws.setId(id);
                    var num = game.addPlayer(pws);
                    ws.send(JSON.stringify({
                        type: HeartsWSServer.PROTOCOL_JOINGAME,
                        success: true,
                        num: num,
                        id: id
                    }));
                    break;
                case HeartsWSServer.PROTOCOL_STARTGAME:
                    var id = ws.id;
                    this.games[id].startGame();
                    ws.send(JSON.stringify({
                        type: HeartsWSServer.PROTOCOL_STARTGAME,
                        success: true
                    }));
                    break;
                case HeartsWSServer.PROTOCOL_SETHANDAROUND:
                    var id = ws.id;
                    var num = ws.num;
                    var handaround = json.cards.map(function (x) { return new Card_1.Card(x.num, x.suitn); });
                    console.log(handaround);
                    console.log(num);
                    this.games[id].setHandaround(num, handaround);
                    ws.send(JSON.stringify({
                        type: HeartsWSServer.PROTOCOL_SETHANDAROUND,
                        success: true
                    }));
                    break;
                case HeartsWSServer.PROTOCOL_PLAYCARD:
                    var id = ws.id;
                    var num = ws.num;
                    this.games[id].playCard(num, new Card_1.Card(json.card.num, json.card.suitn));
                    ws.send(JSON.stringify({
                        type: HeartsWSServer.PROTOCOL_PLAYCARD,
                        success: true
                    }));
                    break;
                case HeartsWSServer.PROTOCOL_INDIVIDUAL_UPDATE:
                    var id = ws.id;
                    var num = ws.num;
                    console.log(id);
                    var status = this.games[id].getStatus(num);
                    ws.send(JSON.stringify({
                        type: HeartsWSServer.PROTOCOL_INDIVIDUAL_UPDATE,
                        success: true,
                        status: status
                    }));
                    break;
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    HeartsWSServer.PROTOCOL_NEWGAME = 0;
    HeartsWSServer.PROTOCOL_JOINGAME = 1;
    HeartsWSServer.PROTOCOL_STARTGAME = 2;
    HeartsWSServer.PROTOCOL_SETHANDAROUND = 3;
    HeartsWSServer.PROTOCOL_PLAYCARD = 4;
    HeartsWSServer.PROTOCOL_INDIVIDUAL_UPDATE = 50;
    HeartsWSServer.PROTOCOL_BROADCAST_UPDATE = 100;
    HeartsWSServer.PROTOCOL_BROADCAST_ROUNDCOMPLETE = 101;
    HeartsWSServer.PROTOCOL_BROADCAST_GAMECOMPLETE = 102;
    return HeartsWSServer;
}());
exports.HeartsWSServer = HeartsWSServer;
//# sourceMappingURL=HeartsWSServer.js.map