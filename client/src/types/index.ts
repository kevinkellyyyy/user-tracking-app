export interface LocationData {
  latitude: number;
  longitude: number;
}

// WebSocket response types
export interface UserState {
  latitude: number;
  longitude: number;
}

export interface UserData {
  state: UserState;
  username: string;
}

export interface UsersResponse {
  [uuid: string]: UserData;
}
