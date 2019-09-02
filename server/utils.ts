import { PingClientArgs, IsDOSArgs } from './types';

const isJSON = (data: string) => {
  let res = true;
  try {
    JSON.parse(data);
  } catch(e) {
    res = false;
  }
  return res;
};

const pingClient = ({ wss, wsClientsTimestamps, wsClientsDosCases }: PingClientArgs) => {
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        wsClientsTimestamps.delete(ws);
        wsClientsDosCases.delete(ws);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping(null, false, true);
    });
  }, 10000);
};

const isDOS = ({ ws, now, wsClientsTimestamps, wsClientsDosCases }: IsDOSArgs) => {
  let result = false;
  const lastTimestamp = wsClientsTimestamps.get(ws);
  wsClientsTimestamps.set(ws, now);

  if (lastTimestamp && now - lastTimestamp < 200) {
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
