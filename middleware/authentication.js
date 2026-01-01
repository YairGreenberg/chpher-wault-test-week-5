import { checkUser, checkUserName } from "../services/auth.js";
export async function authenticateUser(req, res, next) {
  try {
    const { password, username } = req.body;

    if (!username || !password) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing credentials" });
    }

    const checkUsername = await checkUser(username, password);
    

    if (checkUsername === "userFound!") {
      next();
    } else {
      res.status(200).json({ msg: "failure login" });
    }
    return;
  } catch (error) {
    console.error(`Authentication error: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function authenticateUserAndPassword(req, res, next) {
  try {
    const username = req.headers["x-username"];
    const password = req.headers["x-password"];

    if (!username || !password) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing credentials" });
    }
    const checkUsername = await checkUser(username, password);

    if (checkUsername === "userFound!") {
      next();
    } else {
      res.status(200).json({ msg: "failure login" });
    }
    return;
  } catch (error) {
    console.error(`Authentication error: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function authenticateUserName(req, res, next) {
  try {
    const { username } = req.body;

    if (!username) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing credentials" });
    }

    const check = await checkUserName(username);

    if (check === "user not found !") {
      next();
    } else {
      res.status(200).json({ msg: "existing user!" });
    }
    return;
  } catch (error) {
    console.error(`Authentication error: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
