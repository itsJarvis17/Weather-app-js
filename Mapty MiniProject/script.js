"use strict";

// // prettier-ignore
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

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
let map, mapEvent;
// Creating a Geolocation
const getCurrentLocation = function (position) {
  //   console.log(position);
  const { latitude, longitude } = position.coords;
  //   console.log(latitude, longitude);
  //   console.log(
  //     `https://www.google.com/maps/@${latitude},${longitude},13z?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D`
  map = L.map("map").setView([latitude, longitude], 13);

  L.tileLayer("http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("A pretty CSS popup.<br> Easily customizable.")
    .openPopup();

  //   console.log(map);
  // Displaying Map using Leaflet Library
  map.on("click", function (mapE) {
    mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  });
};

navigator.geolocation.getCurrentPosition(getCurrentLocation, function () {
  alert("To get your current location please allow location on your browser");
});

form.addEventListener("submit", function (e) {
  //Display Marker with form details
  // console.log(mapEvent);
  e.preventDefault();

  L.marker([mapEvent.latlng.lat, mapEvent.latlng.lng])
    .addTo(map)
    .bindPopup("Home", {
      maxWidth: 300,
      maxHeight: 50,
      autoClose: false,
      className: "running-popup",
      closeOnClick: false,
    })
    .openPopup();

  inputCadence.value =
    inputDistance.value =
    inputDuration.value =
    inputElevation.value =
      "";
});

inputType.addEventListener("change", function () {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});
