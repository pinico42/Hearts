import * as WebSocket from 'ws';
import { PlayerScore } from './HeartsGame';
import { PlayerStatus } from './PlayerStatus';
import { HeartsWSServer, WSProperties } from './HeartsWSServer';

export class PlayerWebSocket {
    ws: WebSocket;
    playerNum: number;
    properties: WSProperties;

    constructor(ws: WebSocket, properties: WSProperties) {
        this.ws = ws;
        this.properties = properties;
    }

    setId(id: string) {
        this.properties.id = id;
    }

    setPlayerNum(playerNum: number) {
        this.playerNum = playerNum;
        this.properties.num = playerNum;
    }

    updateStatus(status: PlayerStatus) {
        this.ws.send(JSON.stringify({
            type: HeartsWSServer.PROTOCOL_BROADCAST_UPDATE,
            status: status
        }));
    }

    roundCompleteUpdate(victor: number) {
        this.ws.send(JSON.stringify({
            type: HeartsWSServer.PROTOCOL_BROADCAST_ROUNDCOMPLETE,
            victor: victor
        }));
    }

    gameCompleteUpdate(playerScores: PlayerScore[]) {
        this.ws.send(JSON.stringify({
            type: HeartsWSServer.PROTOCOL_BROADCAST_GAMECOMPLETE,
            playerScores: playerScores
        }));
    }
}