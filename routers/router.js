import express from "express";
import supabase from "../db/connectSupaBase.js";
import dataBaseMDB from "../db/connectMongoDb.js";
import {
  authenticateUser,
  authenticateUserAndPassword,
  authenticateUserName,
} from "../middleware/authentication.js";
import { reverseString, atbash } from "../services/ciphhers.js";
import { ObjectId } from "mongodb";
const router = express();

import "dotenv/config";

const mongoDb_NAME = process.env.MONGODB_NAME;

router.post("/api/auth/register", authenticateUserName, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing credentials" });
    }

    const date = new Date();
    const collection = await dataBaseMDB.collection(mongoDb_NAME).insertOne({
      username: username,
      password: password,
      createdAt: date,
      encryptedMessagesCount: 0,
    });

    res.status(201).json({ id: collection.insertedId, username: username });
  } catch (error) {
    console.error(`Authentication error: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/api/messages/encrypt", authenticateUser, async (req, res) => {
  const { message, cipherType, username } = req.body;
  if (!message || !cipherType) {
    return res.status(401).json({ error: "Unauthorized: Missing credentials" });
  }
  if (cipherType === "reverse") {
    const revers = reverseString(message);
    const { error } = await supabase
      .from("messagesTable")
      .insert({
        username: username,
        id: parseInt(new ObjectId()),
        cipher_type: cipherType,
        encrypted_text: revers,
        inserted_at: new Date(),
      });
    if (error) {
      return res.status(404).json({ msg: error });
    }const coll = await dataBaseMDB
      .collection(mongoDb_NAME)
      .find({username:username})
      .toArray();
    const collection = await dataBaseMDB
      .collection(mongoDb_NAME)
      .updateOne(
        { username:username },
        { $set: { encryptedMessagesCount: collection+1 } }
      );

    return res
      .status(201)
      .json({
        id: parseInt(new ObjectId()),
        cipherType: "reverse",
        encryptedText: revers,
      });
  }
  if (cipherType === "atbash") {
    let messageUpper = message.toUpperCase();
    const atbashOP = atbash(messageUpper);
    const { error } = await supabase
      .from("messagesTable")
      .insert({
        username: username,
        id: parseInt(new ObjectId()),
        cipher_type: cipherType,
        encrypted_text: atbashOP,
        inserted_at: new Date(),
      });
    if (error) {
      return res.status(404).json({ msg: error });
    }
    const collection = await dataBaseMDB
      .collection(mongoDb_NAME)
      .updateOne(
        { _id: new ObjectId() },
        { $set: { encryptedMessagesCount: +1 } }
      );

    return res
      .status(201)
      .json({
        id: parseInt(new ObjectId()),
        cipherType: "atbash",
        encryptedText: atbashOP,
      });
  }
});

router.post("/api/messages/decrypt", authenticateUser, async (req, res) => {
  const { messageId } = req.body;

  if (!messageId) {
    return res.status(401).json({ error: "Unauthorized: Missing credentials" });
  }
  const id = parseInt(messageId);
  const collection = await dataBaseMDB
    .collection(mongoDb_NAME)
    .find({ _id: messageId })
    .toArray();
  if (collection.cipherType === "reverse") {
    const { error, data } = await supabase
      .from("messagesTable")
      .find({ id: { $eq: id } });
    const revers = reverseString(data.encrypted_text);
    return res
      .status(201)
      .json({ id: id, cipherType: "reversible", decryptedText: revers });
  } else {
    res
      .status(200)
      .json({ id: 12, decryptedText: null, error: "CANNOT_DECRYPT" });
  }
  if (collection.cipherType === "atbash") {
    const { error, data } = await supabase
      .from("messagesTable")
      .find({ id: { $eq: id } });
    let messageUpper = data.encrypted_text.toUpperCase();
    const atbashOP = atbash(messageUpper);
    return res
      .status(201)
      .json({ id: id, cipherType: "atbash", decryptedText: atbash });
  } else {
    res
      .status(200)
      .json({ id: 12, decryptedText: null, error: "CANNOT_DECRYPT" });
  }
});
router.get("/api/users/me", authenticateUserAndPassword, async (req, res) => {
  const username = req.headers["x-username"];
  const password = req.headers["x-password"];
  if (!username || !password) {
    return res.status(401).json({ error: "Unauthorized: Missing credentials" });
  }
  const collection = await dataBaseMDB
    .collection(mongoDb_NAME)
    .find({ password: password })
    .toArray();

  res
    .status(200)
    .json({
      username: collection.username,
      encryptedMessagesCount: collection.encryptedMessagesCount,
    });
});

export default router;
