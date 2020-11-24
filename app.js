const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const helmet = require("helmet");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
const serverUrl = `https://url-shortener-av.herokuapp.com:${port}/`;

mongoose.connect(
  "mongodb+srv://mrswagbhinav:WFcUf57ZdC6FQYb3@cluster0.bugur.mongodb.net/url_shortener?retryWrites=true&w=majority",
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

function generateId(len) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}

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
  const _id = req.body._id ? req.body._id : generateId(6);
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
  console.log(`${serverUrl}`);
});
