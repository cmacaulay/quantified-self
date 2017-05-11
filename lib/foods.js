$(document).ready(function() {
  fetchFoods();
});

function fetchFoods () {
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/api/foods"
  })
  .then(function( foods ) {
    let foodString;
    foods.forEach (function( food ){
      foodString = JSON.stringify(food)
      localStorage.setItem(`${food.id}`, foodString)
    });
  });
};
