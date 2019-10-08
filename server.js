const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const jwt = require("jsonwebtoken");

const Users = require("./models/Users");
const Mails = require("./models/Mails");

server.listen(5000, () => console.log("Servidor iniciado en puerto 5000"));

app.use("/", express.static("public"));
app.use(express.json());

io.on("connection", socket => {
  socket.on("subscribe", data => {
    const decoded = jwt.verify(data.token, "llavesecreta");
    socket.join(decoded.sub);
  });
});

app.post("/auth", async (req, res) => {
  const { user, password } = req.body;
  const auth = await Users.findOne({
    where: {
      user,
      password
    },
    raw: true
  });
  if (!auth)
    return res.status(400).json({
      msg: "Credenciales incorrectas"
    });
  const payload = {
    sub: auth.id
  };

  jwt.sign(payload, "llavesecreta", { expiresIn: "2d" }, (err, token) => {
    if (err)
      res.status(500).json({
        msg: "Server error"
      });
    else
      res.json({
        token,
        userid: auth.id,
        nickname: auth.nickname,
        username: auth.user
      });
  });
});

app.get("/mails", require("./middleware/auth"), async (req, res) => {
  const id = req.userid;
  const user = await Users.findByPk(id);
  const mails = await Mails.findAll({
    where: {
      to: user.user
    }
  });
  if (!mails)
    return res.json({
      mails: []
    });
  else
    return res.json({
      mails
    });
});

app.get("/mail/:id", require("./middleware/auth"), async (req, res) => {
  const id = req.params.id;
  const userid = req.userid;
  const user = await Users.findByPk(userid);
  const mail = await Mails.findByPk(id);
  if (!mail)
    return res.status(404).json({
      msg: "No existe el mail"
    });
  if (mail.to !== user.user)
    return res.status(401).json({
      msg: "Accesso prohibido"
    });

  return res.json(mail);
});

app.post("/mail", require("./middleware/auth"), async (req, res) => {
  let { to, message } = req.body;
  let from = req.userid;
  const userFrom = await Users.findByPk(from);

  const userTo = await Users.findOne({
    where: {
      user: to
    },
    raw: true
  });

  const user = await Users.findOne({
    where: {
      user: userFrom.user
    },
    raw: true
  });

  if (!userTo)
    res.status(404).json({
      msg: "Destinatario no encontrado"
    });

  from = user.user;

  const mail = await Mails.create({
    from,
    to,
    message
  });

  res.json(mail);

  //Emitir evento
  io.in(userTo.id).emit("newMail", { id: mail.id });
});

app.delete("/mail/:id", async (req, res) => {
  const id = req.params.id;
  await Mails.destroy({
    where: {
      id
    }
  });
});
