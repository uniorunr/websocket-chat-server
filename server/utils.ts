import { ExtendedWebSocket } from './types';

const isJSON = (data: string) => {
  let res = true;
  try {
    JSON.parse(data);
  } catch(e) {
    res = false;
  }
  return res;
};

const pingClient = (
    wsInstance: { clients: Set<ExtendedWebSocket> },
    timestamps: Map<object, number>,
    dosCases: Map<object, number>) => {
  setInterval(() => {
    wsInstance.clients.forEach((ws) => {
      if (!ws.isAlive) {
        timestamps.delete(ws);
        dosCases.delete(ws);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping(null, false, true);
    });
  }, 10000);
};

const isDOS = (
    ws: WebSocket,
    timestamp: number,
    wsClientsMessagesData: Map<object, number>,
    wsClientsDosCases: Map<object, number>) => {
  let result = false;
  const lastTimestamp = wsClientsMessagesData.get(ws);
  wsClientsMessagesData.set(ws, timestamp);

  if (lastTimestamp && timestamp - lastTimestamp < 200) {
    const lastCount = wsClientsDosCases.get(ws) || 0;
    const count = lastCount + 1;
    if (count >= 3) {
      result = true;
      wsClientsDosCases.set(ws, 0);
    }
    wsClientsDosCases.set(ws, lastCount + 1);
  } else wsClientsDosCases.set(ws, 0);

  return result;
};

export { isJSON, pingClient, isDOS };
