export interface Message {
  from: string;
  message: string;
  id: string;
  time: number;
}

export interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
  on: Function;
  terminate: Function;
  ping: Function;
  clients: object[];
}

export interface PingClientArgs {
  wss: { clients: Set<ExtendedWebSocket> };
  wsClientsTimestamps: Map<object, number>;
  wsClientsDosCases: Map<object, number>;
  pingInterval: number;
}

export interface IsDOSArgs {
  ws: WebSocket;
  now: number;
  wsClientsTimestamps: Map<object, number>;
  wsClientsDosCases: Map<object, number>;
}

