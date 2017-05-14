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
      let $calories = $('<td />').text(food.calories).addClass('calories');
      let $deleteIcon = $('<td />').html('<i class="material-icons">remove_circle</i>')
      $tr.append($name).append($calories).append($deleteIcon)
      $(`${selector} tbody`).append($tr);
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
  $.getJSON(createDiaryURL(date, 'breakfast'), (data) => {
    createFoodHandler('#breakfast')(data)
    totalMealCalories('#breakfast');
    dailyCalories();
    remainingDailyCalories();
  })
}

function fetchLunch(date) {
  $.getJSON(createDiaryURL(date, 'lunch'), (data) => {
    createFoodHandler('#lunch')(data)
    totalMealCalories('#lunch');
    dailyCalories();
    remainingDailyCalories();
  })
}

function fetchDinner(date) {
  $.getJSON(createDiaryURL(date, 'dinner'), (data) => {
    createFoodHandler('#dinner')(data)
    totalMealCalories('#dinner');
    dailyCalories();
    remainingDailyCalories();
  })
}

function fetchSnacks(date) {
  $.getJSON(createDiaryURL(date, 'snacks'), (data) => {
    createFoodHandler('#snacks')
    totalMealCalories('#snacks');
    dailyCalories();
    remainingDailyCalories();
  })
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

function totalMealCalories(mealID) {
  let $breakfastFoods = $(`${mealID} tbody tr .calories`);
  let total = 0;
  $breakfastFoods.each(function(index, foodCalorie) {
    total += parseInt($(foodCalorie).text());
  })
  $(`${mealID} tfoot .meal-calories`).text(total);
}

function dailyCalories() {
  let $dailyCalories = $('.meal-calories');
  let total = 0;
  $dailyCalories.each(function(index, calories) {
    total += parseInt($(calories).text());
  })
  $('.calories-consumed').text(total);
  return total;
}

function remainingDailyCalories() {
  let goal = parseInt($('.goal-calories').text());
  let total = parseInt(dailyCalories());
  $('.calories-remaining').text(goal - total);
}
