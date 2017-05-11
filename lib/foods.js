$(document).ready(function() {
  fetchFoods();
});

function fetchFoods () {
  $.ajax({
    method: "GET",
    url: "https://q-self-api.herokuapp.com/api/foods"
  })
  .then(function( foods ) {
      foodItemsString = JSON.stringify(foods)
      localStorage.setItem('foodItems', foodItemsString)
  })
  .then(populateTable)
};

function populateTable () {
  const foodItems = JSON.parse(localStorage.getItem('foodItems'))
  foodItems.forEach(function(food) {
    let foodRow = `
        <tr class='food'>
          <td class='food-name'>${food.name}</td>
          <td class='food-calories'>${food.calories}</td>
          <td class='food-delete'><i class="material-icons">remove_circle</i></td>
        </tr>`;
    $(".food-options tbody").append(foodRow);
  });
};
