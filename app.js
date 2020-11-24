const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const password = process.env.PASSWORD;
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 6);
const serverUrl = `https://url-shortener-av.herokuapp.com/`;

mongoose.connect(
  `mongodb+srv://mrswagbhinav:${password}@cluster0.bugur.mongodb.net/url_shortener?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const urlSchema = mongoose.Schema(
  {
    _id: String,
    url: String,
  },
  { versionKey: false }
);

const Url = mongoose.model("urls", urlSchema);

app.set("view engine", "pug");

app.use(helmet());
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("./public"));

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/:id", (req, res) => {
  Url.findById(req.params.id, (err, docs) => {
    try {
      return res.redirect(`${docs.url}`);
    } catch {
      return res
        .status(404)
        .render("404", { title: "404 - Error", message: "Invalid URL" });
    }
  });
});

app.post("/url", (req, res) => {
  const _id = req.body._id ? req.body._id : nanoid();
  const url = req.body.url;
  const newUrl = new Url({ _id: _id, url: url });

  newUrl.save((err, docs) => {
    if (err) {
      return res.status(404).render("404", {
        title: "404 - Error",
        message: "Slug in Use",
      });
    }

    return res.render("created", {
      title: "URL Shortened!",
      id: `${serverUrl}${_id}`,
      url: url,
    });
  });
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
