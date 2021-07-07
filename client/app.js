const form = document.querySelector("form");
const getBtn = document.getElementById("get-weather");
const weatherContainer = document.querySelector(".weather-container");
const mainSection = document.getElementsByTagName("main")[0];
const imageInfo = document.querySelector(".image__info");

// console.log(mainSection[0]);

// fetch API for Openweather
const base_url = `http://localhost:3000/api?city=`;

async function getWeather(city) {
  let requestUrl = base_url + `${city}`;
  let request = await fetch(requestUrl, {
    method: "GET",
  });

  let data = await request.json();

  if (data.error) {
    displayError(data.error.message);
    return;
  }

  // console.log(data);
  return data;
}

// Error handling
function displayError(message) {
  weatherContainer.innerHTML = "";
  document.body.style.backgroundImage = "";
  imageInfo.innerHTML = "";
  let errorDiv = document.createElement("h2");
  errorDiv.textContent = message;
  weatherContainer.appendChild(errorDiv);
}

// Create the elements on DOM
function createElementOnDOM(data) {
  weatherContainer.innerHTML = "";

  let imageURL = data.image.urls.regular;
  let authorName = data.image.user.username;
  let authorLink = data.image.user["portfolio_url"];

  // console.log(authorLink, authorName);

  document.body.style.backgroundImage = `url("${imageURL}")`;

  // Create image info
  imageInfo.innerHTML = "";

  let authorP = document.createElement("p");
  let authorATag = document.createElement("a");
  let unsplashRef = document.createElement("small");

  authorP.textContent = "Photo by: ";
  authorATag.textContent = authorName;
  authorATag.href = authorLink;
  authorATag.setAttribute("target", "_blank");
  unsplashRef.innerHTML = `from <a href="https://unsplash.com/" target="_blank">https://unsplash.com/</a>`;
  authorP.appendChild(authorATag);

  imageInfo.appendChild(authorP);
  imageInfo.appendChild(unsplashRef);

  // Create main weather data object
  let weatherData = document.createElement("div");
  weatherData.classList.add("weather-data");

  // Create the city Div + img source icon
  let city = document.createElement("div");
  city.classList.add("city");
  let cityName = document.createElement("h2");
  cityName.textContent = data.name + ", " + data.country;
  city.appendChild(cityName);

  weatherData.appendChild(city);

  // create temperatur div and temp span
  let temp = document.createElement("div");
  temp.classList.add("temperature");
  let spanTemp = document.createElement("span");
  spanTemp.setAttribute("id", "temp");
  spanTemp.textContent = Math.round(data.temp);
  let unitsTemp = document.createElement("span");
  unitsTemp.textContent = "°C";

  // weather.main
  let main = data.weather.main.toLowerCase();

  const image_url = `http://openweathermap.org/img/wn/${data.weather.icon}@2x.png`;
  let image = document.createElement("img");
  image.alt = main;
  image.src = image_url;

  // mainSection.setAttribute("class", main);

  temp.appendChild(image);
  temp.appendChild(spanTemp);
  temp.appendChild(unitsTemp);

  weatherData.appendChild(temp);

  // create a description div
  let description = document.createElement("div");
  description.classList.add("description");
  let text = document.createElement("p");
  text.textContent = data.weather.description;
  description.appendChild(text);

  weatherData.appendChild(description);

  // append to container
  weatherContainer.appendChild(weatherData);
}

function isValid(city) {
  if (city.trim() == "") {
    return false;
  }
  return true;
}

getBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let city = formData.get("city");
  if (isValid(city)) {
    let data = await getWeather(city);
    if (data) {
      createElementOnDOM(data);
    }
  }

  form.reset();
});
