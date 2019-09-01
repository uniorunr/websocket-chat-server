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

