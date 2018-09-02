
import * as WebSocket from 'ws';
import { HeartsGameManager } from './HeartsGameManager';
import { PlayerWebSocket } from './PlayerWebSocket';
import { Card } from './Card';

export interface WSProperties {
    id: string,
    num: number
}

export class HeartsWSServer {

    static PROTOCOL_NEWGAME = 0;
    static PROTOCOL_JOINGAME = 1;
    static PROTOCOL_STARTGAME = 2;
    static PROTOCOL_SETHANDAROUND = 3;
    static PROTOCOL_PLAYCARD = 4;

    static PROTOCOL_INDIVIDUAL_UPDATE = 50;

    static PROTOCOL_BROADCAST_UPDATE = 100;
    static PROTOCOL_BROADCAST_ROUNDCOMPLETE = 101;
    static PROTOCOL_BROADCAST_GAMECOMPLETE = 102;


    games: { [id: string]: HeartsGameManager; } = {};
    wss: any;

    constructor(public port: number = 8001) {
        console.log("Binding WSS to port "+port);
        this.wss = new WebSocket.Server({ port: port });
        this.wss.on('connection', this.onConnect.bind(this));
    }

    genId(): string {
        var currentIds = Object.keys(this.games);
        var nid = Math.floor(Math.random() * 65535) - 32767;
        var sid = ('0000' + ((nid + 32767).toString(16))).slice(-4);
        if (currentIds.indexOf(sid) == -1) {
            return sid;
        } else {
            return this.genId();
        }
    }

    onConnect(ws: WebSocket) {
        console.log("New connection");
        var properties: WSProperties = { id: null, num: null };
        ws.on('message', msg => {
            this.onMessage.bind(this)(ws, msg, properties)
        });
    }

    onMessage(ws: WebSocket, msg: string, properties: WSProperties) {
        try {
            var json = JSON.parse(msg);
        } catch (e) {
            ws.send(JSON.stringify({
                "errcode": 1,
                "message": "Invalid Syntax"
            }));
            var json: any = {type:-1}
        }
        try {
            switch (json.type) {
                case HeartsWSServer.PROTOCOL_NEWGAME:
                    var id = this.genId();
                    this.games[id] = new HeartsGameManager();
                    var pws = new PlayerWebSocket(ws, properties);
                    pws.setId(id);
                    console.log(properties);
                    console.log(pws);
                    var num = this.games[id].addPlayer(pws);
                    ws.send(JSON.stringify({
                        type: HeartsWSServer.PROTOCOL_NEWGAME,
                        num: num,
                        id: id,
                    }));
                    break;
                case HeartsWSServer.PROTOCOL_JOINGAME:
                    var id: string = json.id;
                    var game = this.games[id];
                    if (!game) {
                        ws.send(JSON.stringify({
                            type: HeartsWSServer.PROTOCOL_JOINGAME,
                            success: false
                        }));
                        break;
                    }
                    var pws = new PlayerWebSocket(ws, properties);
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
                    var id: string = properties.id;
                    this.games[id].startGame();
                    ws.send(JSON.stringify({
                        type: HeartsWSServer.PROTOCOL_STARTGAME,
                        success: true
                    }));
                    break;
                case HeartsWSServer.PROTOCOL_SETHANDAROUND:
                    var id: string = properties.id;
                    var num: number = properties.num;
                    var handaround = json.cards.map(x => new Card(x.num, x.suitn));
                    this.games[id].setHandaround(num, handaround);
                    ws.send(JSON.stringify({
                        type: HeartsWSServer.PROTOCOL_SETHANDAROUND,
                        success: true
                    }));
                    break;
                case HeartsWSServer.PROTOCOL_PLAYCARD:
                    var id: string = properties.id;
                    var num: number = properties.num;
                    this.games[id].playCard(num, new Card(json.card.num, json.card.suitn));
                    ws.send(JSON.stringify({
                        type: HeartsWSServer.PROTOCOL_PLAYCARD,
                        success: true
                    }));
                    break;
                case HeartsWSServer.PROTOCOL_INDIVIDUAL_UPDATE:
                    var id: string = properties.id;
                    var num: number = properties.num;
                    var status = this.games[id].getStatus(num);
                    ws.send(JSON.stringify({
                        type: HeartsWSServer.PROTOCOL_INDIVIDUAL_UPDATE,
                        success: true,
                        status: status
                    }));
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }
}