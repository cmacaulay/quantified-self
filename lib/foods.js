const $ = require('jquery');
const host = 'http://localhost:3000/api/foods'
// const host = 'https://q-self-api.herokuapp.com/api/foods'

$(document).ready(function() {
  fetchFoods();

  $('.new-food').submit(handleNewFood);
  $('.food-options').on('click', '.food-delete', () => {
    handleDeletingFood();
  });
  $('.food-options').on('click', '.food-name, .food-calories', () => {
    handleFoodEdit();
  });
  $('#food-search').keyup(searchFoods);
  $('.food-options').on('keypress', '.food-edit', () => {
    enterEditPress();
  });
});

function fetchFoods () {
  $.ajax({
    method: "GET",
    url: host
  })
  .then(function( foods ) {
    storeFoodsLocally(foods);
  })
  .then(populateTable);
};

function storeFoodsLocally (foods) {
  foodItemsString = JSON.stringify(foods);
  localStorage.setItem('foodItems', foodItemsString);
}

function populateTable () {
  const foodItems = JSON.parse(localStorage.getItem('foodItems'));
  foodItems.forEach(function(food) {
    addRow(food);
  });
};

function addRow(food) {
  let foodRow = `
      <tr class='food ${food.name}' id=${food.id} >
        <td class='food-name'>${food.name}</td>
        <td class='food-calories'>${food.calories}</td>
        <td class='food-delete'><i class="material-icons" id=${food.id}>remove_circle</i></td>
      </tr>`;
  $(".food-options tbody").prepend(foodRow);
};

function handleFieldErrors (newFood) {
  clearErrors();
  checkForName(newFood['name']);
  checkForCalories(newFood['calories'])
};

function checkForName (name) {
  if (!name) {
    $('.name-validation-error').html('Please enter a food name');
  };
};

function checkForCalories (calories) {
  if (!calories) {
    $('.calories-validation-error').html('Please enter a calorie amount');
  };
};

function clearErrors () {
  $('.name-validation-error').empty();
  $('.calories-validation-error').empty();
};

function handleNewFood () {
  event.preventDefault();
  $newFood = new Object

  $newFood['name'] = $("input[name=food-name]").val();
  $newFood['calories'] = $("input[name=food-calories]").val();

  handleFieldErrors($newFood);

  const finalForm = {food: $newFood}
  $.ajax({
    url: host,
    method: 'POST',
    data: finalForm
  })
  .then(function(addedFood){
    addRow(addedFood);
    $('.new-food').trigger("reset");
    clearErrors();
  });
};

function handleFoodEdit () {
  const td = event.target;
  const value = td.innerText
  const $input = $(`<input class="food-edit" type="text"
                      placeholder="${value}"
                      />`);
  const id = td.parentElement.id
  let changedAttribute
  if (td.className === "food-name") {
     changedAttribute = "name"
  } else {
       changedAttribute = "calories";
  }
  $(td).replaceWith($input)
  replaceValue($input, id, changedAttribute)
};

function enterEditPress (){
  if (event.which == 13) {
    const input = event.target;
    const id = input.parentElement.id
    const changedAttribute = determineChangedAttribute(input)
    replaceValueOnEnter(input, id, changedAttribute)
  }
}

function replaceValueOnEnter (input, id, attribute) {
  let newVal
    newVal = $(input).val();
    const oldVal = input.placeholder
    if (newVal) {
      $(input).replaceWith(`<td class="food-name">${newVal}</td>`)
      updateFood(newVal, id, attribute)
    } else {
      $(input).replaceWith(`<td class="food-name">${oldVal}</td>`)
    };
};

function determineChangedAttribute (input) {
  if (input.nextElementSibling.className == "food-calories") {
    return "name"
  } else {
    return "calories"
  }
}

function replaceValue (input, id, attribute) {
  let newVal
  $(input).blur(function(){
    newVal = $(this).val();
    const oldVal = this.placeholder
    if (newVal) {
      $(this).replaceWith(`<td class="food-name">${newVal}</td>`)
      updateFood(newVal, id, attribute)
    } else {
      $(this).replaceWith(`<td class="food-name">${oldVal}</td>`)
    };
  });
};

function updateFood (update, id, attribute) {
  const newData = new Object
  newData[`${attribute}`] = update
  form = {food: newData}
  patchCall(id, form)
  .fail( (error) => {
    console.error(error)
  });
};

function patchCall (id, form) {
  return $.ajax({
    url: `${host}/${id}`,
    method: 'PATCH',
    data: form
  })
}

function handleDeletingFood () {
  const target = event.target
  const id = target.id
  const form = {food: {status: 'inactive'}}
  patchCall(id, form)
  .then(removeFoodRow(target))
  .fail((error) =>{
    console.error(error)
  });
};

function removeFoodRow ( child ) {
  $(child).parentsUntil("tbody").remove();
};

function searchFoods() {
  const $input = $('#food-search');
  let filter = $($input).val().toUpperCase();
  let $tr = $('#foods-table').find(".food");

  let $td, i;

  for (i = 0; i < $tr.length; i++) {
    $td = $($tr[i]).find(".food-name")[0];
      if ($td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        $tr[i].style.display = "";
      } else {
        $tr[i].style.display = "none";
      };
  };
};
