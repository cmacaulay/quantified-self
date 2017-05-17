const $ = require('jquery');

class Calories {

  static totalMealCalories(mealID) {
    let $breakfastFoods = $(`${mealID} tbody tr .calories`);
    let total = 0;
    $breakfastFoods.each(function(index, foodCalorie) {
      total += parseInt($(foodCalorie).text());
    })
    $(`${mealID} tfoot .meal-calories`).text(total);
    return total;
  }

  static dailyCalories() {
    let $dailyCalories = $('.meal-calories');
    let total = 0;
    $dailyCalories.each(function(index, calories) {
      total += parseInt($(calories).text());
    })
    $('#calories-consumed').text(total);
    return total;
  }

  static remainingDailyCalories() {
    let goal = parseInt($('.goal-calories').text());
    let total = parseInt(this.dailyCalories());
    $('#calories-remaining').text(goal - total);
    this.calorieColorWarnings('calories-remaining', (goal - total))
  }

  static remainingMealCalories(meal) {
    let goals = {
      breakfast: 400,
      lunch: 600,
      dinner: 800,
      snacks: 200
    };

    let total      = parseInt(this.totalMealCalories(`#${meal}`));
    let difference = goals[meal] - total

    $(`#${meal}-remaining-calories`).text(difference);
    this.calorieColorWarnings(`${meal}-remaining-calories`, difference)
  };

  static calorieColorWarnings(id, difference) {
    if (difference >= 0) {
      $(`#${id}`).attr("class", "green")
    } else {
      $(`#${id}`).attr("class", "red")
    };
  }
}

module.exports = Calories;
