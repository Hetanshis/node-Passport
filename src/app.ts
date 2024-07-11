import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { sequelize } from "./config/db";
import { Routers } from "./routes";
import session from "express-session";
import passport from "passport";
import User from "./models/userModel";

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// sequelize db connect
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });
// Env file connect
dotenv.config();

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(
  session({
    secret: `${process.env.SECRET_KEY}`,
    resave: true,
    saveUninitialized: true,
  })
);
app.use("/upload", express.static("upload"));

// Jwt connection with Secret Key
const jwtOptions = {
  secretOrKey: `${process.env.SECRET_KEY}`,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// Passport Jwt connect
passport.use(
  new JwtStrategy(jwtOptions, async (payload: any, done: any) => {
    try {
      // User find id with particular data
      const user = await User.findByPk(payload.id);

      if (!user) {
        return done(null, false);
      }

    

      // return with Json file
      done(null, user.toJSON());
    } catch (error) {
      done(error);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// Upload image public folder
app.use(express.static("public"));


app.use("/", new Routers().router);
// Run this Port
app.listen(`${process.env.PORT}`, () => {
  console.log(`Server is running on this PORT:-http://${process.env.Host}:${process.env.PORT}`);
});

// Routers connect

