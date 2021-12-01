//variable declarations
const searchButton = document.querySelector("#searchButton"); // links to element with search button and input field
const apiKey = "66cae1bd334eb7747100576e02048328";
const prevSearches = document.querySelector("#previousSearchList"); // links to where the buttons for previous searches will be appended in html
let currentWeatherEl = document.querySelector("#currentWeather"); // links to where the current weather information will be appended in html
const futureWeatherEl = document.querySelector("#futureForecast"); // links to where the future forecast cards will be appended in html

//functions
// keeps button appended to page through page refresh
window.onload = () => {
  userInput = JSON.parse(localStorage.getItem("data")); //get data from storage and parse into json object
  if (userInput !== null) {
    //if data exist - enter codeblock
    userInput.forEach(function (cityName) {
      // function is responsible for recreating buttons from localstorage in reappending them to the dom
      const entry = document.createElement("button"); // recreates button from local storage data
      entry.setAttribute(
        "class",
        "btn btn-primary justify-content-center w-100 mt-2 prevSearchButton"
      ); // sets the css styling attributes for the new button
      entry.textContent = cityName; // enters the city stored in local memory as text for button
      document.querySelector("#previousSearchList").append(entry); // appends the button to the dom
    });
  } else {
    //if nothing exist in storage, keep userInput array empty
    userInput = [];
  }
};

// creates a list of buttons comprising of users previous choices
const createCityButton = function (cityName) {
  const newCityButton = document.createElement("button"); // creates new button
  newCityButton.setAttribute(
    "class",
    "btn btn-primary justify-content-center w-100 mt-2 prevSearchButton"
  ); // sets the css styling attributes for new button
  newCityButton.textContent = cityName; // enters the users input as name for button
  document.querySelector("#previousSearchList").append(newCityButton); // appends new button to the dom
};

// function is responsible for fetching the api and creating the current weather element and appending it to the dom
var currentWeather = function (cityName) {
  const currentApiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

  fetch(currentApiURL)
    .then(function (res) {
      // if api is resolved return the data as a json object
      return res.json();
    })
    .then(function (data) {
      // pass data into function
      console.log(data);

      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}` // fetch new api with information received from original api
      )
        .then(function (res) {
          // if resolved return data in json object
          return res.json();
        })
        .then(function (oneData) {
          // pass data into function
          console.log("one", oneData);

          const uvi = oneData.daily[0].uvi; // grab value of current uv index

          const template = `
        <div class="currentBlock">
          <h2>
            ${data.name} (${new Date().toLocaleDateString()})
            <img src="https://openweathermap.org/img/w/${
              data.weather[0].icon
            }.png">
          </h2>
          <p>Temp: ${data.main.temp}F</p>
          <p>Wind Speed: ${data.wind.speed}mph</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p id="uvi"><span id="span">UVIndex: ${uvi}</span></p>
        </div>
      `; // build current weather html in a template literal passing api data through expressions
          currentWeatherEl.innerHTML = template; // append to the dom

          // responsible for setting the color of the uv index text based on the value of the uv index, seperated into severity
          if (uvi <= 2.99) {
            document.querySelector("#uvi").style.color = "green";
            document.querySelector("#span").style.background = "black";
            return;
          } else if (uvi >= 3 && uvi <= 5.99) {
            document.querySelector("#uvi").style.color = "yellow";
            document.querySelector("#span").style.background = "black";
            return;
          } else if (uvi >= 6 && uvi <= 7.99) {
            document.querySelector("#uvi").style.color = "orange";
            document.querySelector("#span").style.background = "black";
            return;
          } else if (uvi >= 8 && uvi <= 10.99) {
            document.querySelector("#uvi").style.color = "red";
            document.querySelector("#span").style.background = "black";
            return;
          } else if (uvi >= 11) {
            document.querySelector("#uvi").style.color = "purple";
            document.querySelector("#span").style.background = "black";
            return;
          }
        });
    });
};

// function responsible for fetching api data building the future weather cards and appending to the dom
var futureForecast = function (cityName) {
  const futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;

  fetch(futureApiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      // responsible for determining which days go in the future cards
      const filterData = data.list.filter(function (listItem) {
        if (listItem.dt_txt.indexOf("00:00:00") > -1) {
          return true;
        } else {
          return false;
        }
      });

      let template = "";

      filterData.forEach(function (data) {
        template += `
          <div class="card forecastTiles">
              <div class="card-body">
                <h2 class="card-title">
                      ${new Date(data.dt_txt).toLocaleDateString()}
                      <img src="https://openweathermap.org/img/w/${
                        data.weather[0].icon
                      }.png">
                </h2>
                <p>Temp: ${data.main.temp}F</p>
                <p>Wind Speed: ${data.wind.speed}mph</p>
                <p>Humidity: ${data.main.humidity}%</p>
              </div>
          </div>
          `;
      }); // build future weather cards html in a template literal passing api data through expressions
      futureWeatherEl.innerHTML = template; // appends future cards to the dom
    });
};

//event listeners

// responsible for submitting user data in form, calling functions to build and append the current weather, future weather sections and the button for users previous choices, and add users city choice into local storage
document.querySelector("#form").addEventListener("submit", function (event) {
  event.preventDefault(); // prevents the page from refreshing on button click

  var userCity = document.querySelector("#cityInput").value; // captures user city input
  currentWeather(userCity); // calls currentWeather function passing in userCity as an argument
  futureForecast(userCity); // call futureForecast function passing in userCity as an argument
  createCityButton(userCity); // calls createCityButton function passing in userCity as an argument

  const hide = document.querySelector("#hide"); // assigns section with id hide to variable hide
  hide.classList.remove("hide"); // removes the class hide from the section with id hide

  const allData = JSON.parse(localStorage.getItem("data")) || []; // stores the values of the key data from local storage into an json object or empty array if no data is in local storage
  const userInput = document.querySelector("#cityInput").value; // stores the user city input in userInput variable

  allData.push(userInput); // pushes the user city input to local storage array
  localStorage.setItem("data", JSON.stringify(allData)); // sets user city input in local storage
  document.querySelector("#cityInput").value = ""; // removes text from user input field after search button is clicked
});

// responsible for functionality of users previous choices buttons
prevSearches.addEventListener("click", function (event) {
  if (event.target.className.indexOf("prevSearchButton") > -1) {
    currentWeather(event.target.textContent); // recalls and appends the current forecast data for this city
    futureForecast(event.target.textContent); // recalls and appends the future forecast data for this city
  }
});
