export const TICK_RATE = 20;
export const MS_PER_TICK = 1000 / TICK_RATE;

export interface PlayerData {
  x: number;
  y: number;
  rotation: number;
  vx: number;
  vy: number;
}

export type Players = Record<string, PlayerData>;
export type Projectiles = Record<string, ProjectileData>;
export interface GameState {
  players: Players;
  projectiles: Projectiles;
}

export interface Welcome {
  id: string;
  gameState: GameState;
}

export interface NewPlayer {
  id: string;
  data: PlayerData;
}

export type NetMessage<Type extends string, Payload> = {
  type: Type;
  payload: Payload;
};

export interface ProjectileData {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export type GameMessage =
  | NetMessage<"update_player", PlayerData>
  | NetMessage<"player_leave", { id: string }>
  | NetMessage<"welcome", Welcome>
  | NetMessage<"new_player", NewPlayer>
  | NetMessage<"tick", GameState>
  | NetMessage<"sync", PlayerData>
  | NetMessage<"shoot", ProjectileData>;
