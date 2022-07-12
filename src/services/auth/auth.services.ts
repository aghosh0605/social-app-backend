import db from "../../loaders/database";
import { Db } from "mongodb";
import * as bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import Logger from "../../loaders/logger";

export const LoginUser = async (username: string, password: string) => {
  const data: Db = await db();
  const userExists = await data.collection("users").findOne({
    username: username,
  });
  if (!userExists) {
    Logger.info("Uses not found");
    throw console.error("User not found");
  } else {
    const valid = await bcrypt.compare(password, userExists?.password);
    if (valid) {
      const token = sign(
        {
          admin_logged_in: true,
          username: username,
        },
        process.env.SECRET_KEY!,
        {
          issuer: "Cario Growth Services",
          expiresIn: "24h",
        }
      );
      return token;
    } else {
      Logger.info("JWT Error");
      throw console.error("JWT error");
    }
  }
};

export const SignupUser = async (username: string, password: string) => {
  const data: Db = await db();
  const userExist = await data
    .collection("users")
    .findOne({ username: username });
  if (userExist) {
    throw console.error("User already Exist");
  } else {
    bcrypt.genSalt(10, function (err: Error | undefined, salt: string) {
      if (!err) {
        bcrypt.hash(
          password,
          salt,
          async function (err: Error | undefined, hash: string) {
            if (!err) {
              await data.collection("users").insertOne({
                username: username,
                password: hash,
              });
            } else {
              Logger.info(err);
            }
          }
        );
      } else {
        Logger.info(err);
      }
    });
  }
};
