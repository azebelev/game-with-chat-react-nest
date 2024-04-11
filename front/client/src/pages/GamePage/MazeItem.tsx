import { ChildCare, ZoomInMap } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { GameField, GameFieldItem } from '../../hooks/useGameConnection';

export function MazeItem({
  item,
  gameField,
  coordinates,
}: {
  item: GameFieldItem;
  gameField: GameField;
  coordinates: { x: number; y: number };
}) {
  const { userPlayer, opponent } = gameField;
  const userExist = userPlayer.x === coordinates.x && userPlayer.y === coordinates.y;
  const opponentExist = opponent.x === coordinates.x && opponent.y === coordinates.y;
  return (
    <Stack
      sx={{
        height: '30px',
        width: '30px',
        bgcolor: item.isWall ? 'primary.main' : 'inherit',
        position: 'relative',
      }}
    >
      {userExist ? (
        <ChildCare
          sx={{ color: 'green', position: 'absolute', zIndex: 10, mx: opponentExist ? -1 : 0 }}
        />
      ) : null}
      {opponentExist ? (
        <ChildCare sx={{ color: 'red', position: 'absolute', background: 'white' }} />
      ) : null}
      {item.isWall === null ? <ZoomInMap sx={{ position: 'absolute' }} /> : null}
      {item.breadcrumbs && !userExist && !opponentExist ? (
        <ChildCare sx={{ color: 'lightgrey', scale: '0.8' }} />
      ) : null}
    </Stack>
  );
}
