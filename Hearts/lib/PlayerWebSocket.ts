import * as WebSocket from 'ws';
import { PlayerScore } from './HeartsGame';
import { PlayerStatus } from './PlayerStatus';
import { HeartsWSServer } from './HeartsWSServer';

export class PlayerWebSocket {
    ws: WebSocket;
    playerNum: number;

    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    setId(id: string) {
        this.ws.id = id;
    }

    setPlayerNum(playerNum: number) {
        this.playerNum = playerNum;
        this.ws.num = playerNum;
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