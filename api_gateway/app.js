const gateway = require("fast-gateway");
var jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  let token = null;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, "microsevice");
        req.user = decode.user;
        next();
      } catch (error) {
        res.status(400).send(error.message);
      }
    }
    if (!token) {
      res.setHeader("content-type", "application/json");
      res.status(401).json({
        message: "Authentication failed",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const server = gateway({
  routes: [
    //Auth service
    {
      prefix: "auth",
      target: "http://127.0.0.1:3000",
    },
    //proudct service
    {
      prefix: "/product",
      target: "http://127.0.0.1:3001",
      middlewares: [checkAuth],
    },
    // category service
    {
      prefix: "/category",
      target: "http://127.0.0.1:3002",
      middlewares: [checkAuth],
    },
  ],
});

const PORT = 8080;
server.start(PORT).then(() => {
  console.log(`Api Gateway Listening on http://localhost:${PORT}`);
});
