const isJSON = (data) => {
  let res = true;
  try {
    JSON.parse(data);
  } catch(e) {
    res = false;
  }
  return res;
};

const pingClient = (wsInstance, timestamps, dosCases) => {
  setInterval(() => {
    wsInstance.clients.forEach(ws => {
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

const isDOS = (ws, timestamp, wsClientsMsgsData, wsClientsDosCases) => {
  let result = false;
  const lastTimestamp = wsClientsMsgsData.get(ws);
  wsClientsMsgsData.set(ws, timestamp);
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

exports.isJSON = isJSON;
exports.pingClient = pingClient;
exports.isDOS = isDOS;
