var express = require("express");
var router = express.Router();
var users = require("../users.json");
var jwt = require("jsonwebtoken");

const { validateToken } = require("../middleware/verifyToken");

router.post("/api/auth", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  // res.json(req.body);
  let user = users.find((user) => user.email === email);
  if (user !== undefined && user !== "") {
    if (user.password === password) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          data: { id: user.id, email: user.email, status: user.status },
        },
        process.env.JWT_SECRET_KEY
      );
      res.status(200).json({ token: token });
    } else {
      res.status(400).json({
        error: true,
        message: "Wrong password",
      });
    }
  } else {
    res.status(400).json({
      error: true,
      message: "Wrong email and password",
    });
  }
});

router.post("/api/auth/signup", async (req, res, next) => {
  const { email, password } = req.body;

  users.push({ email: email, password: password, status: true });
  res.status(200).json({
    message: "user created",
    user: { email, password, status: true },
  });
});

router.get("/api/users", validateToken, async (req, res) => {
  res.status(200).json({
    count: users.length,
    users: users,
  });
});

module.exports = router;
