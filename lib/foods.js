const local = 'http://localhost:3000/api/foods'
const host = 'https://q-self-api.herokuapp.com/api/foods'

$(document).ready(function() {
  fetchFoods();

  $('.new-food').submit(handleNewFood);
});

function fetchFoods () {
  $.ajax({
    method: "GET",
    url: host
  })
  .then(function( foods ) {
      foodItemsString = JSON.stringify(foods);
      localStorage.setItem('foodItems', foodItemsString);
  })
  .then(populateTable);
};

function populateTable () {
  const foodItems = JSON.parse(localStorage.getItem('foodItems'));
  foodItems.forEach(function(food) {
    addRow(food);
  });
};

function addRow(food) {
  let foodRow = `
      <tr class='food'>
        <td class='food-name'>${food.name}</td>
        <td class='food-calories'>${food.calories}</td>
        <td class='food-delete'><i class="material-icons">remove_circle</i></td>
      </tr>`;
  $(".food-options tbody").append(foodRow);
};

function handleNewFood () {
  event.preventDefault();
  $newFood = new Object

  $newFood['name'] = $("input[name=food-name]").val();
  $newFood['calories'] = $("input[name=food-calories]").val();

  const finalForm = {food: $newFood}
  $.ajax({
    url: host,
    method: 'POST',
    data: finalForm
  })
  .then(function(addedFood){
    addRow(addedFood)
    $('.new-food').trigger("reset");
  });
};
