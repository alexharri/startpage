require("dotenv").config();
const express     = require("express");
const cors        = require("cors");
const bodyParser  = require("body-parser");
const Twitter     = require("twitter");
const headers     = require("./headers");

const port = 3000;
const app = express();

// Serve static files in production
// app.use(express.static(__dirname));

app.use(headers.headers);
app.use(bodyParser.json());
app.use(cors());


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

let currentImage = null;

const fetchNewestTweet = () => {
  setTimeout(() => {
    fetchNewestTweet();
  }, 1000 * 60 * 10); // Archillect uploads a new photo every 10 minutes
  client.get("statuses/user_timeline", params, (err, response) => {
    if (err) {
      console.error(err);
    } else if (response[0].extended_entities.media[0].type === "animated_gif") {
      currentImage = {
        url: response[0].extended_entities.media[0].video_info.variants[0].url,
        type: "animated_gif",
      };
    } else if (response[0].extended_entities.media[0].type === "photo") {
      console.log(response[0].entities.media[0].media_url_https);
      currentImage = {
        url: response[0].entities.media[0].media_url_https,
        type: "photo",
      };
    } else {
      throw new Error("Type is neither photo nor animated_gif");
    }
  });
};

fetchNewestTweet();

app.get("/fetchNewestArchillectMedia", (req, res) => {
  // For testing
  // res.json({ type: "photo", url: "https://pbs.twimg.com/media/C3sU5gqUEAEBLLn.jpg" });
  res.json(currentImage);
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
