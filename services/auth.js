import "dotenv/config";
import dataBaseMDB from "../db/connectMongoDb.js";
const mongoDb_NAME = process.env.MONGODB_NAME;

export const checkUser = async (username, password) => {
  const collection = await dataBaseMDB
    .collection(mongoDb_NAME)
    .find({ username: { $eq: username } })
    .toArray();

  if (collection === 0) {
    return `user not found !`;
  } else {
    if (collection[0].password !== password) {
      return `wrong password!`;
    } else {
      return `userFound!`;
    }
  }
};

export const checkUserName = async (username) => {
  const collection = await dataBaseMDB
    .collection(mongoDb_NAME)
    .find({ username: username })
    .toArray();

  if (collection.length === 0) {
    return `user not found !`;
  } else {
    return `existing user!`;
  }
};
