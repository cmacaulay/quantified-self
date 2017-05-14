const moment = require('moment');
const $ = require('jquery');
let currentDate = moment();
const host = 'https://q-self-api.herokuapp.com/api'

$(document).ready(function() {
  setDate();
  fetchDiaryInfo();
  $('#previous-day').on('click', previousDay)
  $('#next-day').on('click', nextDay)
});

function setDate() {
  $('#date').text(currentDate.format('MMMM Do YYYY'));
}

function createFoodHandler(selector) {
  function handleFoodData(data) {
    data.forEach((food) => {
      let $tr = $('<tr />');
      let $name = $('<td />').text(food.food_name);
      let $calories = $('<td />').text(food.calories);
      let $deleteIcon = $('<td />').html('<i class="material-icons">remove_circle</i>')
      $tr.append($name).append($calories).append($deleteIcon)
      $(`${selector} tbody`).append($tr)
    })
  }
  return handleFoodData
}

function createDiaryURL(date, category) {
  let year = date.year();
  let month = date.month() + 1;
  let day = date.date();
  return `${host}/meals/${category}/${year}/${month}/${day}`
}

function fetchBreakfast(date) {
  $.getJSON(createDiaryURL(date, 'breakfast'), createFoodHandler('#breakfast'));
}

function fetchLunch(date) {
  $.getJSON(createDiaryURL(date, 'lunch'), createFoodHandler('#lunch'));
}

function fetchDinner(date) {
  $.getJSON(createDiaryURL(date, 'dinner'), createFoodHandler('#dinner'));
}

function fetchSnacks(date) {
  $.getJSON(createDiaryURL(date, 'snacks'), createFoodHandler('#snacks'));
}

function fetchDiaryInfo() {
  $('tbody.foods').html('');
  fetchBreakfast(currentDate);
  fetchLunch(currentDate);
  fetchDinner(currentDate);
  fetchSnacks(currentDate);
}

function previousDay() {
  currentDate = currentDate.subtract(1, "days");
  setDate();
  fetchDiaryInfo();
}

function nextDay() {
  currentDate = currentDate.add(1, "days");
  setDate();
  fetchDiaryInfo();
}
