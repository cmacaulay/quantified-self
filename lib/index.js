const moment = require('moment');
const $ = require('jquery');
let currentDate = moment();
const Calories = require('./calories')
const host = 'https://q-self-api.herokuapp.com/api'

$(document).ready(function() {
  setDate();
  fetchDiaryInfo();
  $('#previous-day').on('click', previousDay)
  $('#next-day').on('click', nextDay)
  $('.food-options').on('click', '.delete', deleteMealFood)
  $('.add-food-to-meal').on('click', submitFoodToMeal)
  $('#diary-food-search').on('keyup', searchFoods);
});

function deleteMealFood () {
  let id = this.id
  let table = $(this).parents("table")
  let mealId = table[0].id
    $.ajax({
    url: `${host}/meals/${id}`,
    method: 'DELETE'
  })
  .then(removeFoodRow(this))
  .then(Calories.remainingMealCalories(mealId))
  .then(Calories.remainingDailyCalories())
  .fail((error) =>{
    console.error(error)
  });
};

function removeFoodRow(food){
  $(food).parentsUntil("tbody").remove();
}

function setDate() {
  $('#date').text(currentDate.format('MMMM Do YYYY'));
}

function createFoodHandler(selector) {
  function handleFoodData(data) {
    data.forEach((food) => {
      let $tr = $('<tr />');
      let $name = $('<td />').text(food.food_name);
      let $calories = $('<td />').text(food.calories).addClass('calories');
      let $deleteIcon = $(`<td class="delete" id=${food.id}/>`).html(`<i class="material-icons">remove_circle</i>`)
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
    Calories.totalMealCalories('#breakfast');
    Calories.dailyCalories();
    Calories.remainingDailyCalories();
    Calories.remainingMealCalories('breakfast');
  })
}

function fetchLunch(date) {
  $.getJSON(createDiaryURL(date, 'lunch'), (data) => {
    createFoodHandler('#lunch')(data)
    Calories.totalMealCalories('#lunch');
    Calories.dailyCalories();
    Calories.remainingDailyCalories();
    Calories.remainingMealCalories('lunch');
  })
}

function fetchDinner(date) {
  $.getJSON(createDiaryURL(date, 'dinner'), (data) => {
    createFoodHandler('#dinner')(data)
    Calories.totalMealCalories('#dinner');
    Calories.dailyCalories();
    Calories.remainingDailyCalories();
    Calories.remainingMealCalories('dinner');
  })
}

function fetchSnacks(date) {
  $.getJSON(createDiaryURL(date, 'snacks'), (data) => {
    createFoodHandler('#snacks')(data)
    Calories.totalMealCalories('#snacks');
    Calories.dailyCalories();
    Calories.remainingDailyCalories();
    Calories.remainingMealCalories('snacks');
  })
}

function fetchDiaryInfo() {
  $('tbody.foods').html('');
  fetchBreakfast(currentDate);
  fetchLunch(currentDate);
  fetchDinner(currentDate);
  fetchSnacks(currentDate);
  fetchFoods();
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

function fetchFoods() {
  $.getJSON(`${host}/foods`, (data) => {
    data.forEach((food) => {
      let $tr = $('<tr />');
      let $name = $('<td />').text(food.name).addClass('food-name');
      let $calories = $('<td />').text(food.calories).addClass('calories');
      let $check = $(`<td><input value="${food.id}" type="checkbox"> </td>`)
      $tr.append($check).append($name).append($calories)
      $(`#add-foods tbody`).append($tr);
    })
  })
}

function submitFoodToMeal() {
  event.preventDefault();
  let $selected = $('input:checked')
  let foodIds = $selected.map(function(index, checked) {
    return $(checked).val();
  })

  let category = $(this).data('category');

  let meal = { meal: {foodIds: foodIds.toArray().join(','),
                     category: category,
                     date: currentDate.format('YYYY/MM/DD') }
              }

  let options = { breakfast: fetchBreakfast,
                  lunch: fetchLunch,
                  dinner: fetchDinner,
                  snacks: fetchSnacks }

  $.post(`${host}/meals`, meal, () => {
    options[category](currentDate);
    $('input:checked').prop('checked', false);
  })
}

function searchFoods() {
  let $foodNames = $('#add-foods .foods');
  let search = $('#diary-food-search').val().toLowerCase();
  $foodNames.find(`tr:contains(${search})`).show()
  $foodNames.find(`tr:not(:contains(${search}))`).hide();

}
