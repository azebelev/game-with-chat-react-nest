export type Player = { id: number; x: number; y: number };

export type GameField = Array<Array<boolean>>; // detect wall position

export type GameSchema = {
  player1: Player;
  player2: Player;
  field: GameField;
};
