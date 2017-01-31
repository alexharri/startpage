const express     = require("express");
const cors        = require("cors");
const bodyParser  = require("body-parser");
const Twitter     = require("twitter");
require("dotenv").config();

const headers = require("./headers");

const port = 3000;
const app = express();

// Serve static files in production
// app.use(express.static(__dirname));

app.use(headers.headers);
app.use(bodyParser.json());
app.use(cors());

// Process.env this shit
const client = new Twitter({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token_key:     process.env.TWITTER_TOKEN_KEY,
  access_token_secret:  process.env.TWITTER_TOKEN_SECRET,
});

const params = {
  screen_name: "archillect",  // twitter handle
  count: "1",                 // We only need the most recent tweet
  include_entities: "true",   // I think entities simply means media, not sure
};

app.get("/mostRecentArchillectMedia", (req, res) => {
  client.get("statuses/user_timeline", params, (err, response) => {
    if (err) {
      console.error(err);
    } else if (response[0].extended_entities.media[0].type === "animated_gif") {
      res.json({
        url: response[0].extended_entities.media[0].video_info.variants[0].url,
        type: "animated_gif",
      });
    } else if (response[0].extended_entities.media[0].type === "photo") {
      res.json({
        url: response[0].entities.media[0].media_url_https,
        type: "photo",
      });
    } else {
      res.send(new Error("Type is neither photo nor animated_gif"));
    }
  });
});

app.get("/getTweetMediaById/:id", (req, res) => {
  client.get("statuses/show/", {
    id: req.params.id,
    include_entities: "true",
  }, (err, response) => {
    if (err) {
      console.error(err);
    } else if (response.extended_entities.media[0].type === "animated_gif") {
      res.json({
        url: response.extended_entities.media[0].video_info.variants[0].url,
        type: "animated_gif",
      });
    } else if (response.extended_entities.media[0].type === "photo") {
      res.json({
        url: response.entities.media[0].media_url_https,
        type: "photo",
      });
    } else {
      res.send(new Error("Type is neither photo nor animated_gif"));
    }
  });
});

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
