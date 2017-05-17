class Validations {

  static handleFieldErrors (newFood) {
    this.clearErrors();
    this.checkForName(newFood['name']);
    this.checkForCalories(newFood['calories'])
  };

  static checkForName (name) {
    if (!name) {
      $('.name-validation-error').html('Please enter a food name');
    };
  };

  static checkForCalories (calories) {
    if (!calories) {
      $('.calories-validation-error').html('Please enter a calorie amount');
    };
  };

  static clearErrors () {
    $('.name-validation-error').empty();
    $('.calories-validation-error').empty();
  };

}

module.exports = Validations
