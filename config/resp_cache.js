const NodeCache = require("node-cache");
const myCache = new NodeCache();

module.exports = (duration) => (req, res, next) => {
  if (req.method !== "GET") {
    console.log("cannot Cache this method");
    return next();
  }
  const key = req.originalUrl;
  const cached_resp = myCache.get(key);

  if (cached_resp) {
    console.log(`cache hit for ${key}`);
    console.log(myCache.has(key));
    res.send(cached_resp);
  } else {
    console.log(`cache not hit for ${key}`);
    res.originalSend = res.send;
    res.send = (body) => {
      res.originalSend(body);
      myCache.set(key, body, duration);
    };
    console.log(myCache.has(key));
    next();
  }
};
