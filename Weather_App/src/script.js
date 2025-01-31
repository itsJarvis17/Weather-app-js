const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "74f916d0d618806202f813ee80a69811";
const oneKelvin = 273.15;
const inputCity = document.getElementById("input--city");
const searchBtn = document.getElementById("search--btn");
const clearBtn = document.getElementById("clear--btn");
const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const content = document.getElementById("content");
const errorMsg = document.getElementById("error--msg");
const generateMarkup = (data) => {
  const markup = `<div class="my-2">
          <h3 id="city"><strong>Weather in</strong>: ${data.name}</h3>
          <p id="temperature"><strong>Temperature</strong>: ${(
            +data.main.temp - oneKelvin
          ).toFixed(2)}℃</p>
          <p id="description"><strong>Description</strong>: ${
            data.weather[0].description
          }</p>
          <div class="grid grid-cols-2">
            <span>
            <strong>Sunrise</strong>: ${new Date(data.sys.sunrise)
              .getHours()
              .toString()
              .padStart(2, 0)}:${new Date(data.sys.sunrise)
    .getMinutes()
    .toString()
    .padStart(2, 0)} AM</span>
            <span><strong>Sunset</strong>: ${new Date(data.sys.sunset)
              .getHours()
              .toString()
              .padStart(2, 0)}:${new Date(data.sys.sunset)
    .getMinutes()
    .toString()
    .padStart(2, 0)}  PM</span>
          </div>
        </div>`;
  clearAll();
  content.insertAdjacentHTML("afterbegin", markup);
};

const clearAll = () => {
  inputCity.value = "";
  content.firstChild.remove();
};

searchBtn.addEventListener("click", async () => {
  try {
    const cityName = inputCity.value;
    if (!cityName) return;
    const res = await fetch(`${API_URL}/?q=${cityName}&appid=${API_KEY}`);
    const data = await res.json();
    generateMarkup(data);
  } catch (error) {
    clearAll();
    errorMsg.classList.remove("hidden");
    setTimeout(() => {
      errorMsg.classList.add("hidden");
      inputCity.value = "";
    }, 3000);
  }
});

clearBtn.addEventListener("click", () => {
  clearAll();
});
