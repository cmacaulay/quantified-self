var assert    = require('chai').assert;
var webdriver = require('selenium-webdriver');
var test      = require('selenium-webdriver/testing');

test.describe('adding a new food', function() {
  var driver;
  this.timeout(10000);

  test.beforeEach(function() {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();
  })

  test.afterEach(function() {
    driver.quit();
  })

  test.it('should let me add a new food', function() {
    // Given I'm on foods.html
    driver.get("http://localhost:8080/webpack-dev-server/foods.html");
    driver.sleep(3000);
    // When I click into the name field
    var name = driver.findElement({css: '#add-name'});
    name.sendKeys('olive');
    // And I enter "Olive"

    var calories = driver.findElement({css: '#add-calories'})
    calories.sendKeys('50')
    // And I click I click into the calories field
    // And I enter "50"
    driver.findElement({css: '.button .button-small'}).click();
    // When I click "Add Food"
    driver.sleep(1000);
    // It is added to the foods table
    var newFood = driver.findElement({class: '.olive'})
    newFood.getText()
      .then(function (textValue)  {
        console.log(textValue)
      })
  });
});
