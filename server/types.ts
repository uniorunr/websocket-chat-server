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
  wsInstance: { clients: Set<ExtendedWebSocket> };
  timestamps: Map<object, number>;
  dosCases: Map<object, number>;
}

export interface IsDOSArgs {
  ws: WebSocket;
  timestamp: number;
  wsClientsMessagesData: Map<object, number>;
  wsClientsDosCases: Map<object, number>;
}

