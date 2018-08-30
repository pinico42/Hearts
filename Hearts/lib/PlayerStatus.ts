import { Card } from "./Card";
import { Table } from "./Table";
import { Hand } from "./Hand";

export interface PlayerStatus {
    num: number;
    playerNum: number;
    leader: number;
    currentPlayer: number;
    hand: Card[];
    handSizes: number[];
    table: Card[];
}