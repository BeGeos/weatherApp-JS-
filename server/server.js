const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { query } = require("express");
require("dotenv").config();

app = express();

app.use(cors());
app.use(express.json());

// Variables
const API_KEY = process.env.API_KEY;
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
let base_url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric`;
let unsplash_url = `https://api.unsplash.com/search/photos?page=1&orientation=landscape&client_id=${UNSPLASH_API_KEY}`;

let cache = {};

app.get("/api", (req, res) => {
  res.json({ message: "You are in the super secret area" });
});

app.get("/api/:city", async (req, res) => {
  let city = req.params.city;
  try {
    let requestData = await axios.get(base_url + `&q=${city}`);
    let data = requestData.data;

    // Parsed response for relevant information
    let response = {
      temp: data.main.temp,
      weather: data.weather[0],
      name: data.name,
      country: data.sys.country,
    };

    let label = data.weather[0].main.toLowerCase();
    let name = data.name.toLowerCase();
    let query = label + "," + name;

    let index = Math.floor(Math.random() * 11);

    // console.log(cache);

    // Request for picture
    if (Object.keys(cache).includes(query)) {
      response.image = cache[query][index];
    } else {
      // console.log("Make a request");
      let pictureRequest = await axios.get(unsplash_url + `&query=${query}`);
      cache[query] = pictureRequest.data.results;
      response.image = pictureRequest.data.results[index];
    }
    // console.log(response);
    res.json(response);
  } catch (error) {
    // console.log(error.response);
    res.status(error.response.status || 500);
    res.json({ error: error.response.data });
  }
});

app.listen(3000, () => console.log("Listening on port 3000..."));
