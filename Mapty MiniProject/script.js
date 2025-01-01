"use strict";

// // prettier-ignore

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
  id = Date.now().toString().slice(-10);
  distance;
  duration;
  coords;
  date = new Date();
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in Km
    this.duration = duration; // in min
  }

  _setDescription() {
    // console.log(this);
    this.description = `${this.type.toUpperCase()} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  name;
  cadence;
  pace;
  type;
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.type = "running".toLowerCase();
    this._calcPace();
    this._setDescription();
  }

  _calcPace() {
    //in min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

// const run = new Running([-2141, 3234], 5.2, 23, 153);

class Cycling extends Workout {
  name;
  elevatationGain;
  speed;

  constructor(coords, distance, duration, elevatationGain) {
    super(coords, distance, duration);
    this.elevatationGain = elevatationGain;
    this.type = "cycling".toLowerCase();
    this._calcSpeed();
    this._setDescription();
  }

  _calcSpeed() {
    // in Km/hr
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const cycle = new Cycling([3923, 12], 22, 2, 432);
// console.log(run, cycle);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
class App {
  #workouts = [];
  #map;
  #mapEvent;
  workout;
  #zoomLevel = 13;
  description;
  constructor() {
    // Get current location
    this._getPosition();
    // console.log(this.#map);

    // Get workouts from local storage on reload
    this._getWorkoutFromLocalStorage();

    // Attach event handlers
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert(
            "To get your current location please allow location on your browser"
          );
        }
      );
    }
  }

  _loadMap(position) {
    // console.log(position);
    const { latitude, longitude } = position.coords;
    this.#map = L.map("map").setView([latitude, longitude], this.#zoomLevel);

    L.tileLayer("http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));

    // Get workouts from local storage and display on Map
    this.#workouts.forEach((work) => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();
    // console.log(this.#mapEvent.latlng);

    // Take data from input
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;

    // Data validation
    const validateInputs = (...inputs) =>
      inputs.every((input) => Number.isFinite(input) && input > 0);
    // If workout is runninng then create instance of Running obj
    if (type === "running") {
      const cadence = +inputCadence.value;
      // validate all data before creating obj
      if (!validateInputs(distance, duration, cadence))
        return alert("Invalid data");
      this.workout = new Running([lat, lng], distance, duration, cadence);
      // console.log(this.workout);
    }
    // If workout is cycling then create instance of Cycling Obj
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      // validate all data before creating obj
      if (!validateInputs(distance, duration, elevation))
        return alert("Invalid data");
      this.workout = new Cycling([lat, lng], distance, duration, elevation);
      // console.log(this.workout);
    }
    // Add workout to workouts array
    this.#workouts.push(this.workout);
    // Add workouts to local storage
    this._storeWorkoutToLocalStorage();
    // Render workout marker
    this._renderWorkoutMarker(this.workout);
    // Add workout in a list
    this._renderWorkoutList(this.workout);
    // Render Marker on Map
    App._hideForm();

    // console.log(this.#mapEvent);
  }

  static _hideForm() {
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        "";
    form.classList.add("hidden");
  }

  _renderWorkoutMarker(workout) {
    console.log(workout);
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(workout.description, {
        maxWidth: 300,
        maxHeight: 50,
        autoClose: false,
        className: `workout--${workout.type}`,
        closeOnClick: false,
      })
      .openPopup();
  }

  _renderWorkoutList(workout) {
    console.log(workout);
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
    <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
            }</span>
          <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
    `;
    if (workout.type === "running") {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;
    }

    if (workout.type === "cycling") {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevatationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;
    }
    form.insertAdjacentHTML("afterend", html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");
    if (!workoutEl) return;
    const workout = this.#workouts.find(
      (work) => work.id === workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, this.#zoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _getWorkoutFromLocalStorage() {
    const localWorkouts = JSON.parse(localStorage.getItem("workouts"));
    if (!localWorkouts) return;

    this.#workouts = localWorkouts;
    this.#workouts.forEach((work) => {
      this._renderWorkoutList(work);
    });
  }

  _storeWorkoutToLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }

  reset() {
    localStorage.removeItem("workouts");
    location.reload();
  }
}
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") App._hideForm();
});
const app = new App();
