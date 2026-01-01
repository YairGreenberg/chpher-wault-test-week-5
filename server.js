import express from "express";
// import router from "./routers/router.js";
import "dotenv/config";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

// app.get("/", async (req, res) => {
//   res.send("Hello World!");
// });

// app.use("/", router);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
