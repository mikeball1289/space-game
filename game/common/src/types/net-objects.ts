export interface PlayerData {
  x: number;
  y: number;
  rotation: number;
  vx: number;
  vy: number;
}

export type Players = Record<string, PlayerData>;

export interface Welcome {
  id: string;
  players: Players;
}

export interface NewPlayer {
  id: string;
  data: PlayerData;
}

export type NetMessage<Type extends string, Payload> = {
  type: Type;
  payload: Payload;
};

export type GameMessage =
  | NetMessage<"update_player", PlayerData>
  | NetMessage<"player_leave", { id: string }>
  | NetMessage<"welcome", Welcome>
  | NetMessage<"new_player", NewPlayer>
  | NetMessage<"tick", Players>;
