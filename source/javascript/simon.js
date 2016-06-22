$(document).ready(function() {

  var showMask = function() { $("#board-mask").show(); };
  var hideMask = function() { $("#board-mask").hide(); };

  // Check internal power state.
  //
  // If internally on, light up its indicator.
  // If internally off, turn off its indicator.
  var togglePowerIndicator = function() {
    if (power) {
      $("#btn-start > span").addClass("indicator-red-on");
    } else {
      $("#btn-start > span").addClass("indicator-red-off");
    }
  }

  // Check internal strict mode state.
  //
  // If internally on, light up its indicator.
  // If internally off, turn off its indicator.
  var toggleStrictIndicator = function() {
    if (strict) {
      $("#btn-strict > span").addClass("indicator-yellow-on");
    } else {
      $("#btn-strict > span").addClass("indicator-yellow-off");
    }
  }

  gen = function() {
    generateSequence();
  }
  play = function() {
    playSequence();
  }

  generateSequence = function() {

    // Clear existing sequences.
    computerSequence = [];
    userSequence = [];

    // Increment current round by 1.
    currentRound++;

    // Possible elements in sequence.
    var CHOICES = ["green", "red", "yellow", "blue"];

    // Randomly select n elements where n is the current round.
    for (var i=0; i<currentRound; i++) {

      // Randomly select element from CHOICES.
      var idx = Math.floor(Math.random() * CHOICES.length);
      var item = CHOICES[idx];

      // Add to computerSequence.
      computerSequence.push(item);

    }// end random selection.
  }// end generateSequence().

  playSequence = function() {

    // Create an array (queue) of promises.
    //
    var deferreds = $.map(computerSequence, function(value, index) {

      // Get the current colour.
      var colour = value;

      // Create one promise.
      var promise = $.Deferred();

      // Button active.
      setTimeout(function() {

        // Sets appropriate active class according to its colour.
        $("#btn-" + colour).addClass("btn-" + colour + "-active");

      }, (index+1)*1000 + 1000*index);

      // Button inactive.
      setTimeout(function() {

        // Sets appropriate inactive class according to its colour.
        $("#btn-" + colour).removeClass("btn-" + colour + "-active");

        // Resolve this promise.
        promise.resolve();

      }, (index+1)*2000);

      // Return the promise (queue it up)
      return promise;

    })// end deffereds;

    // Wait for array of promises to finish.
    $.when.apply($, deferreds).then(function() {console.log("animation done")});

  }

  //////////////////////////////////////////////////////////////////////////////
  // Toggles the start button indicator and internal power state.
  //////////////////////////////////////////////////////////////////////////////
  $("#btn-start").on("click", function() {

    // If power is on, turn the game off.
    if (power) {

      // Set power to off.
      power = false;
      $(this).children("span")
        .removeClass("indicator-red-on")
        .addClass("indicator-red-off");

      // Indicator off.
      togglePowerIndicator();

      // Prevent button press.
      showMask();

    } else { // If the power is off, turn the game on.

      // Set power to on.
      power = true;
      $(this).children("span")
        .removeClass("indicator-red-off")
        .addClass("indicator-red-on");

      // Indicator on.
      togglePowerIndicator();

      // Allow button press.
      hideMask();
    }
  });

  //////////////////////////////////////////////////////////////////////////////
  // Toggles the strict button indicator and internal strict mode state.
  //////////////////////////////////////////////////////////////////////////////
  $("#btn-strict").on("click", function() {

    // If strict mode is on, turn it off.
    if (strict) {

      // Set strict mode to off.
      strict = false;
      $(this).children("span")
        .removeClass("indicator-yellow-on")
        .addClass("indicator-yellow-off");

      // Indicator off.
      toggleStrictIndicator();

    } else { // If strict mode is off, turn it on.

      // Set strict mode to on.
      strict = true;
      $(this).children("span")
        .removeClass("indicator-yellow-off")
        .addClass("indicator-yellow-on");

      // Indicator on.
      toggleStrictIndicator();
    }
  });






  // Global variables.
  var power = false;
  var strict = false;
  var computerSequence = [];
  var userSequence = [];
  var currentRound = 0;






});
