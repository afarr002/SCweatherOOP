//variable declarations
const searchButton = document.querySelector("#searchButton");
const apiKey = "66cae1bd334eb7747100576e02048328";
const prevSearches = document.querySelector("#previousSearchList");
let currentWeatherEl = document.querySelector("#currentWeather");
const futureWeatherEl = document.querySelector("#futureForecast");

//functions
const createCityButton = function (cityName) {
  //var userCity = document.querySelector("#cityInput").value;
  const newCityButton = document.createElement("button");
  newCityButton.setAttribute(
    "class",
    "btn btn-primary justify-content-center w-100 mt-2 prevSearchButton"
  );
  newCityButton.textContent = cityName;
  document.querySelector("#previousSearchList").append(newCityButton);
};

var currentWeather = function (cityName) {
  const currentApiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

  fetch(currentApiURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`
      )
        .then(function (res) {
          return res.json();
        })
        .then(function (oneData) {
          console.log("one", oneData);

          const uvi = oneData.current.uvi;

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
          <p style="color:${uvi > 2 ? "red" : "green"}">UVIndex: ${uvi}</p>
        </div>
      `;
          currentWeatherEl.innerHTML = template;
        });
    });
};

var futureForecast = function (cityName) {
  const futureApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;

  console.log(futureApiUrl);

  fetch(futureApiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      const filterData = data.list.filter(function (listItem) {
        if (listItem.dt_txt.indexOf("00:00:00") > -1) {
          return true;
        } else {
          return false;
        }
      });
      console.log(filterData);

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
      });
      futureWeatherEl.innerHTML = template;
    });
};

//event listeners
document.querySelector("#form").addEventListener("submit", function (event) {
  event.preventDefault();

  var userCity = document.querySelector("#cityInput").value;
  currentWeather(userCity);
  futureForecast(userCity);
  createCityButton(userCity);

  const hide = document.querySelector("#hide");
  hide.classList.remove("hide");

  const allData = JSON.parse(localStorage.getItem("data")) || [];
  const userInput = document.querySelector("#cityInput").value;

  allData.push(userInput);
  localStorage.setItem("data", JSON.stringify(allData));
  document.querySelector("#cityInput").value = "";
});

prevSearches.addEventListener("click", function (event) {
  if (event.target.className.indexOf("prevSearchButton") > -1) {
    currentWeather(event.target.textContent);
    futureForecast(event.target.textContent);
  }
});

newCityButton.addEventListener("click", function () {
  const allData = JSON.parse(localStorage.getItem("data")) || [];
  const userInput = document.querySelector("#cityInput").value;

  allData.push(userInput);
  localStorage.setItem("data", JSON.stringify(allData));
});

//psuedo code
