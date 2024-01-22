// Define variables to store jQuery elements
let cityInfo = $("#cityData"); // Container for City data info
let searches = $(".pastSearches"); // Container for displaying past searches
let userFormEl = $("#user-form"); // Form element
let cityInputEl = $("#userCity"); // User input for city search
let userSearchBtn = $("#userSearchBtn"); // Submit button

let todaysDate = dayjs(); // Current date using dayjs

const apiKey = "48774715b5f5fb8a452c6ba72a2e6d98"; // API key

// Function to handle form submission
function handleFormSubmit(cityItem) {
  // URL for current weather data
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityItem}&appid=${apiKey}&units=imperial`;

  // Fetch current weather data
  fetch(currentWeatherUrl, {
    cache: "reload",
  })
    .then(response => response.json())
    .then(data => {
      // Handle current weather data
      displayCurrentWeather(data);
    });

  // URL for forecast weather data
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityItem}&appid=${apiKey}&units=imperial`;

  // Fetch forecast weather data
  fetch(forecastUrl, {
    cache: "reload",
  })
    .then(response => response.json())
    .then(data => {
      // Handle forecast weather data
      displayForecast(data);
    });

  // Update stored searches
  updateStoredSearches(cityItem);

  // Clear the form input
  cityInputEl.val("");
}

// Function to display current weather data
function displayCurrentWeather(data) {
  // Extract relevant elements using jQuery
  const cityName = $("#city");
  const cityDate = $("#date");
  const cityTemp = $("#temp");
  const cityWind = $("#wind");
  const cityHumid = $("#humid");
  const weatherIcon = $("#icon");

  // Extract icon code and URL
  const iconCode = data.weather[0].icon;
  const iconURL = `http://openweathermap.org/img/wn/${iconCode}.png`;

  // Display current weather data
  cityName.text(data.name);
  cityDate.text(todaysDate);
  weatherIcon.attr("src", iconURL);
  cityTemp.text(` ${data.main.temp}°F`);
  cityWind.text(` ${data.wind.speed}MPH`);
  cityHumid.text(` ${data.main.humidity}%`);
}

// Function to display forecast weather data
function displayForecast(data) {
  const daysArray = data.list;

  // Loop through forecast data
  for (let i = 0; i < daysArray.length; i++) {
    const date = todaysDate.add(i + 1, "day").format("M/DD");
    const temp = daysArray[i].main.temp;
    const wind = daysArray[i].wind.speed;
    const humidity = daysArray[i].main.humidity;
    const iconCode = daysArray[i].weather[0].icon;
    const iconURL = `http://openweathermap.org/img/wn/${iconCode}.png`;

    // Create elements for each day
    const dateEl = $("<h5>").text(date);
    const iconEl = $("<img>").attr("src", iconURL).attr("style", "width:75px");
    const tempEl = $("<p>").html(`Temp: ${temp}&deg;F`);
    const windEl = $("<p>").html(`Wind: ${wind} MPH`);
    const humidityEl = $("<p>").html(`Humidity: ${humidity}%`);

    // Clear card content and append elements
    $(`#day-${i + 1}`).html("").append(dateEl).append(tempEl).append(iconEl).append(windEl).append(humidityEl);
  }

  // Show forecast and current day elements
  let cards = $("#cards");
  cards.removeAttr("hidden");
  let currentDay = $("#currentDay");
  currentDay.removeAttr("hidden");
}

// Function to update stored searches
function updateStoredSearches(cityItem) {
  // Get old searches from local storage or create an empty array
  let searches = JSON.parse(localStorage.getItem("city")) || [];

  // Add new search if it doesn't exist
  if (cityItem !== "" && !searches.includes(cityItem)) {
    searches.push(cityItem);
    localStorage.setItem("city", JSON.stringify(searches));
  }

  // Display past searches
  displayStoredSearches(searches);
}

// Function to display stored searches
function displayStoredSearches(searches) {
  let pastSearchesContainer = $("#pastSearches");
  pastSearchesContainer.html("");

  // Create buttons for each search
  for (let i = searches.length - 1; i >= 0; i--) {
    let btn = $("<button>")
      .addClass("btn btn-secondary btn-lg btn-block border border-dark")
      .attr("type", "button")
      .text(searches[i])
      .on("click", function () {
        handleFormSubmit(searches[i]);
      });

    pastSearchesContainer.append(btn);
  }
}

// Initial display of stored searches
updateStoredSearches("");
