const isJSON = (data) => {
  let res = true;
  try {
    JSON.parse(data);
  } catch(e) {
    res = false;
  }
  return res;
};

const pingClient = (wsInstance) => {
  setInterval(() => {
    wsInstance.clients.forEach(ws => {
      if (!ws.isAlive) return ws.terminate();

      ws.isAlive = false;
      ws.ping(null, false, true);
    });
  }, 10000);
};

exports.isJSON = isJSON;
exports.pingClient = pingClient;
