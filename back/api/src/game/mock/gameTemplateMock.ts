import { Player } from '../types/gameSchema';

export type GameSchema = {
  player1: { id: number; x: number; y: number };
  player2: { id: number; x: number; y: number };
  field: Array<Array<boolean | null>>;
};

function parseMaze(
  player1Id: number,
  player2Id: number,
  maze: string,
): GameSchema {
  const cleanedMaze = maze
    .trim()
    .split('\n')
    .map((row) => row.trim());
  const field: Array<Array<boolean | null>> = [];
  const players: Player[] = [];

  cleanedMaze.forEach((row, rowIndex) => {
    const fieldRow: Array<boolean | null> = [];
    row.split('').forEach((cell, columnIndex) => {
      switch (cell) {
        case '1':
          players.push({
            id: player1Id,
            x: columnIndex,
            y: rowIndex,
          });
          fieldRow.push(false);
          break;
        case '2':
          players.push({
            id: player2Id,
            x: columnIndex,
            y: rowIndex,
          });
          fieldRow.push(false);
          break;
        case 'w':
          fieldRow.push(true);
          break;
        case '-':
          fieldRow.push(false);
          break;
        case 'e':
          fieldRow.push(null);
          break;
        default:
          throw new Error(`Invalid cell type '${cell}' in the maze.`);
      }
    });
    field.push(fieldRow);
  });
  if (players.length < 2) throw new Error(`Less than 2 players in the maze.`);
  return {
    player1: players[0],
    player2: players[1],
    field,
  };
}

const maze1 = `
1---w--w-w-www2
www-w--w-w-www-
ww-----w-w-----
w--www---w-wwww
w------e---wwww`;

const getGameSchemaMock = (player1Id: number, player2Id: number) => {
  const mazes = [maze1];
  const randomIndex = Math.floor(Math.random() * mazes.length);
  const gameSchema = parseMaze(player1Id, player2Id, mazes[randomIndex]);
  return gameSchema;
};

export { getGameSchemaMock };
