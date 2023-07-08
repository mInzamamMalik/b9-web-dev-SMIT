import express from "express";
import path from "path";
import { connectDB, commentsModel } from "./db.mjs";

const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json()); // body parser

//Connect to the mongodb database with my app with mongoose before listening
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Examples app listening on port ${PORT}`)
    );
  })
  .catch((err) => console.log("db err", err));

app.get("/profile", (req, res) => {
  console.log("this is profile!", new Date());
  res.send("this is profile" + new Date());
});

app.get("/comments", async (req, res, next) => {
  try {

    const dbRes = await commentsModel.find();

    console.log("all data from db", dbRes);

    res.send({
      message: "all data from db received successfully",
      data: dbRes,
    });

  } catch (err) {

    res.status(500).send({ message: err.message || "error hy koi server ma" });
 
  }
});

app.post("/comment/:name", async (req, res, next) => {

  //   console.log("🚀 ~ file: server.mjs:29 ~ app.post ~ req:", req);

  const name = req.params.name;
  const comment = req.body.comment;

  try {

    const dbRes = await commentsModel.create({ name: name, comment: comment });
  
    console.log("saved", dbRes);
  
    res.send({ message: "comment posted successfully" });
  
  } catch (err) {
   
    res.status(500).send({ message: err.message || "error hy koi server ma" });
 
  }
});

app.use(express.static(path.join(__dirname, "public")));
