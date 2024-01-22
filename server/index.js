require("dotenv").config({ path: `./server/.env.${process.env.NODE_ENV}` });
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");
const uuid = require("node-uuid");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const _passport = require("./passport/passport");
const cookie = require("cookie");
const multer = require("multer");
const FormData = require("form-data");
const pef1 = require("./pef1");
const { decrypt, encrypt } = require("./pef2");
const crypto = require("crypto");
const _ = require("lodash");
const CassandraStore = require("cassandra-store");
const cassandra = require("cassandra-driver");
const jp = require("jsonpath");
const match = require("path-match")({
  // path-to-regexp options
  sensitive: false,
  strict: false,
  end: true,
});
var fs = require("fs");
const url = require("url");
const apiClient = require("./api");

var privateKey = fs.readFileSync(path.join(__dirname, "sslcert/key.pem"));
var certificate = fs.readFileSync(path.join(__dirname, "sslcert/cert.pem"));

var credentials = { key: privateKey, cert: certificate };

const app = express();
var http;

if (process.env.NODE_ENV == "local") {
  http = require("https").createServer(credentials, app);
} else {
  http = require("http").createServer(app);
}

const sess = {
  secret: "wajito",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, //one day
  },
};

//session options
if (process.env.NODE_ENV === "local") {
  sess.store = new FileStore({});
  sess.store.on("error", function (error) {
    console.log(error);
  });
}

app.use(cookieParser());
app.use(session(sess));
app.use(
  cors({ origin: JSON.parse(process.env.CORS_WHITE_LIST), credentials: true })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.disable("x-powered-by");

app.use(passport.initialize());
app.use(passport.session());

_passport(passport);

const checkApiPermissions = (config, permissions, req) => {
  let permission;
  let request = `${config.method.toUpperCase()} ${config.baseURL}${config.url}`;

  try {
    let api = request.match(/^(GET|POST|PATCH|DELETE|PUT)(.+)$/);
    let Url = url.parse(api[2]);
    permission = `${api[1]} ${Url.pathname}`;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const port = +process.env.SERVER_PORT;

const getUserData = async (req, res) => {
  try {
    let userData;
    let { type } = req.body;

    if (!type) {
      console.log("%c%s", "color: #ff0000", "no username, no password");
      res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
    }
    //login user
    if (type == "web_support") {
      let response = await apiClient(
        {
          baseURL: process.env.AUTH_API,
          method: "post",
          url: "/v1/login",
          data: {
            domain: process.env.AUTH_DOMAIN,
            user: req.body.username,
            password: req.body.password,
          },
        },
        req,
        res
      );
      userData = response.data;
    }

    if (type == "google" || type == "facebook") {
      await apiClient(
        {
          baseURL: process.env.AUTH_API,
          method: "post",
          url: "/v1/social/login",
          data: {
            domain: process.env.AUTH_DOMAIN,
            type: req.body.type,
            token: req.body.token,
          },
        },
        req,
        res
      )
        .then((response) => {
          userData = response.data;
        })
        .catch((err) => {
          throw err;
        });
    }

    if (type == "line") {
      await apiClient(
        {
          baseURL: process.env.AUTH_API,
          method: "post",
          url: "/v1/social/login",
          data: {
            domain: process.env.AUTH_DOMAIN,
            type: req.body.type,
            token: req.body.token,
            email: req.body.email,
            picture: req.body.picture,
          },
        },
        req,
        res
      )
        .then((response) => {
          userData = response.data;
        })
        .catch((err) => {
          throw err;
        });
    }

    //return user data
    return {
      username: userData.user,
      first_name: userData.name,
      last_name: userData.last_name,
      properties: userData.properties,
      permissions: userData.permission,
      authenticated: true,
      requests: {},
      roles: userData.roles,
      key: crypto.randomBytes(50).toString("base64").slice(0, 50),
      jwt: {
        access_token: userData.access_token,
        refresh_token: userData.refresh_token,
      },
      type: userData.type,
      picture: userData.picture,
      email: userData.email,
    };
  } catch (e) {
    throw e;
  }
};

//generate private key and public key and save it to the session
app.use((req, res, next) => {
  try {
    // console.log("publicKey");
    // if (typeof req.session.data === "undefined") {
    //   console.log("no session");
    //   console.log(req.session);
    // } else {
    //   console.log(req.session.data.publicKey);
    // }
    // console.log('BODY', JSON.stringify(req.body));
    // console.log('HEADER', JSON.stringify(req.headers));
    // console.log('QUERY', JSON.stringify(req.query));
    // console.log('PARAMS', JSON.stringify(req.params));
  } catch (e) {
    console.error("LOG error", e);
  }

  if (!req.session.data) {
    req.session.data = {};
    req.session.signatures = [];
    req.session.data.permissions = [
      "GET /rbac/v1/user",
      "POST /message/v2/otp",
      "GET /message/v1/otp",
    ]; //TODO
  }
  next();
});

//generate private key and public key and save it to the session
app.use((req, res, next) => {
  if (!req.session.privateKey) {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048, // the length of your key in bits
      publicKeyEncoding: {
        type: "spki", // recommended to be 'spki' by the Node.js docs
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8", // recommended to be 'pkcs8' by the Node.js docs
        format: "pem",
      },
    });
    req.session.privateKey = privateKey;
    req.session.data = {
      ...req.session.data,
      publicKey,
      permissions: [], //TODO
    };
  }
  next();
});

//decrypt request pef2 from client with private key
app.use((req, res, next) => {
  if (!_.isEmpty(req.body)) {
    const { v } = req.body;
    if (v === "pef2") {
      try {
        let txt = JSON.stringify(req.body);
        let decrypted = decrypt(req.session.privateKey, txt);
        req.body = JSON.parse(decrypted.message);
        // console.log("DECRYPTED", JSON.stringify(req.body));
      } catch (e) {
        console.log(e);
        return next({
          status: 405,
          message: e.message,
        });
      }
    } else {
      return next({ status: 405, message: "Can't decrypt request" });
    }
  }

  return next();
});

//Add Server Public Folder. Same location used for webpack-dev Server
app.use("/public", express.static(path.join(__dirname, "public")));

//check remember token
app.use(async (req, res, next) => {
  if (!req.session.data && req.url !== "/logout") {
    // const data = await getUserData(req, res);
    // req.session.data = {
    //   ...req.session.data,
    //   ...data,
    // };
    req.session.data = {
      ...req.session.data,
    };
  }
  next();
});

app.post("/logout", (req, res) => {
  // req.logout();
  // req.session.destroy();
  // res.send();
  req.logout();
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.send();
  });
});

app.post("/login", async (req, res) => {
  try {
    let { jwt, ...data } = await getUserData(req, res);
    req.session.data = {
      ...req.session.data,
      ...data,
    };
    req.session.jwt = jwt;

    res.send(req.session.data);
  } catch (e) {
    if (e.response) {
      console.log(e.response.data.message);
      res.status(e.response.status ? e.response.status : 400).send({
        message: e.response.data.message
          ? e.response.data.message
          : "server error",
      });
    } else {
      console.log(e);
      res.status(400).send(e);
    }
  }
});

app.get("/session", (req, res) => {
  res.json(req.session.data);
});

app.post("/session", (req, res) => {
  res.send(req.session.data);
});

// Handles api requests
app.post("/api", async (req, res, next) => {
  try {
    // console.log(req.session, "Session  $$$$$$$$$$$$$$$$$");
    // console.log(req.session.data, "Session.data  $$$$$$$$$$$$$$$$$");
    // console.log(req.body.url, "Body URL  $$$$$$$$$$$$$$$$$");
    // console.log(
    //   req.session.data.authenticated,
    //   "Authenticated  $$$$$$$$$$$$$$$$$"
    // );
    // check session timeout
    if (!req.session.data.authenticated) {
      return next({
        status: 440,
        message: "Session expired",
      });
    }

    let body = req.body;

    //check api permissions
    checkApiPermissions(body, req.session.data.permissions, req);

    const response = await apiClient(body, req, res);

    response.data.config = response.config;
    res.status(response.status).send(response.data);
  } catch (e) {
    console.error("ERROR=>", JSON.stringify(e));
    if (e.response) {
      return res.status(e.response.status).send(e.response.data);
    } else {
      return res.status(500).send(e.message);
    }
  }
});

app.get("/server/line/login", passport.authenticate("line"));

app.get(
  "/server/line/callback",
  passport.authenticate("line", {
    failureRedirect: "/",
    successRedirect: `${process.env.BASE_PATH}/line/callback`,
  })
);

app.get("/server/line/success", (req, res) => {
  if (req.session.passport.user) {
    res.status(200).json({
      ...req.session.passport.user,
    });
  }
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

//catch errors
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    return res.status(err.status).send(err.message);
  } else {
    return res.status(500).send({ message: "server error" });
  }
});

http.listen(port, "0.0.0.0", () => {
  console.log(`App listening on port ${port} and on ${process.env.NODE_ENV}`);
});
