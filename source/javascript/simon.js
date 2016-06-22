$(document).ready(function() {

  //////////////////////////////////////////////////////////////////////////////
  // Hides or shows transparent layer separating the board buttons and the
  // control panel.
  //////////////////////////////////////////////////////////////////////////////
  var showMask = function() { $("#board-mask").show(); };
  var hideMask = function() { $("#board-mask").hide(); };

  //////////////////////////////////////////////////////////////////////////////
  // Toggles the boards Start indicator.
  //////////////////////////////////////////////////////////////////////////////
  var togglePowerIndicator = function() {

    // Check internal state to see if power is turned on.
    if (power) {

      // If internal state is on, board indicator is active.
      $("#btn-start > span").addClass("indicator-red-on");
      $("#btn-start > span").removeClass("indicator-red-off");

    } else {

      // If internal state is off, board indicator is inactive.
      $("#btn-start > span").addClass("indicator-red-off");
      $("#btn-start > span").removeClass("indicator-red-on");

    }
  }// end togglePowerIndicator().

  //////////////////////////////////////////////////////////////////////////////
  // Toggles the boards Strict Mode indicator.
  //////////////////////////////////////////////////////////////////////////////
  var toggleStrictIndicator = function() {

    // Check internal state to see if Strict Mode is turned on.
    if (strict) {

      // If Strict Mode is on, board indicator is on.
      $("#btn-strict > span").addClass("indicator-yellow-on");
      $("#btn-strict > span").removeClass("indicator-yellow-off");

    } else {

      // If Strict Mode is off, board indicator is off.
      $("#btn-strict > span").addClass("indicator-yellow-off");
      $("#btn-strict > span").removeClass("indicator-yellow-on");

    }
  }// end toggleStrictIndicator()

  //////////////////////////////////////////////////////////////////////////////
  //
  //
  //
  // *** SHORTHAND DEBUGGING FUNCTIONS ***
  //
  //
  //
  //////////////////////////////////////////////////////////////////////////////
  gen = function() {
    generateSequence();
  };
  play = function() {
    playSequence();
  };
  blink = function(x) {
    blinkLCD(x);
  }
  record = function() {
    recordPattern();
  }

  //////////////////////////////////////////////////////////////////////////////
  // Performs a blink animation on the LCD with a given string of text.
  //////////////////////////////////////////////////////////////////////////////
  var blinkLCD = function(text) {

    // A sequence of actions to be performed.
    var actions = function() {

      // Create a deferred sequence of actions.
      var deferred = $.Deferred();

      // Switch between the given string of text and dashes at 700ms intervals.
      setTimeout(function() { $("#lcd").text(text); }, 700);
      setTimeout(function() { $("#lcd").text("--"); }, 1400);
      setTimeout(function() { $("#lcd").text(text); }, 2100);
      setTimeout(function() { $("#lcd").text("--"); }, 2800);
      setTimeout(function() { // Final animation, finish at 800ms after previous.

        // Show current round number.
        $("#lcd").text(currentRound);

        // Deferred actions are done.
        deferred.resolve();
      }, 3600);

      // Return sequence.
      return deferred.promise();
    }

    // Execute actions.
    var promise = actions();

    // When actions are done, run this function.
    promise.done(function() {
      // Not implemented.
    });
  }// end blinkLCD().

  //////////////////////////////////////////////////////////////////////////////
  // Generate an internal sequence of colours which the user will play back.
  // The number of colours is the same as the current round number.
  //////////////////////////////////////////////////////////////////////////////
  var generateSequence = function() {

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

  //////////////////////////////////////////////////////////////////////////////
  // Plays the current internal sequence of colours.
  //////////////////////////////////////////////////////////////////////////////
  var playSequence = function() {

    // Prevent button presses.
    showMask();

    // Create a sequence of queued actions.
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

      // Return the action (queue it up)
      return promise;

    })// end deffereds;

    // Wait for array of promises to finish.
    $.when.apply($, deferreds).then(function() {

      // Allow button presses.
      hideMask();

    });
  }// end playSequence().

  //////////////////////////////////////////////////////////////////////////////
  // Toggles the Start Indicator and internal power state.
  //////////////////////////////////////////////////////////////////////////////
  $("#btn-start").on("click", function() {

    // If internal power state is on, turn the game off.
    if (power) {

      // Set power to off.
      power = false;

      // Toggle Indicator.
      togglePowerIndicator();

      // Prevent button press.
      showMask();

    } else { // If the internal power state is off, turn the game on.

      // Set power to on.
      power = true;

      // Toggle Indicator.
      togglePowerIndicator();

      // Allow button press.
      hideMask();

      // Generate sequence.
      //generateSequence();

      // Play back sequence.
      //playSequence();

    }
  });

  //////////////////////////////////////////////////////////////////////////////
  // Toggles the strict button indicator and internal strict mode state.
  //////////////////////////////////////////////////////////////////////////////
  $("#btn-strict").on("click", function() {

    // If internal Strict Mode is on, turn it off.
    if (strict) {

      // Set Strict Mode to off.
      strict = false;

      // Toggle Indicator.
      toggleStrictIndicator();

    } else { // If internal Strict Mode is off, turn it on.

      // Set Strict Mode to on.
      strict = true;

      // Toggle Indicator.
      toggleStrictIndicator();
    }
  });

  //////////////////////////////////////////////////////////////////////////////
  // Board Button Events
  //////////////////////////////////////////////////////////////////////////////

  var recordPattern = function() {
    $(".btn").on("click", function() {

      // A sequence of buttion animations to be performed.
      var btnAnimations = function(btn, colour) {

        // Create a deferred sequence of actions.
        var deferred = $.Deferred();

        // Set button to active.
        setTimeout(function() {

          //Add its appropriate active class.
          $(btn).addClass("btn-" + colour + "-active");

        }, 0);

        // Set button to inactive.
        setTimeout(function() {

          // Remove its appropriate active class.
          $(btn).removeClass("btn-" + colour + "-active");

          // Deferred actions are done.
          deferred.resolve();
        }, 600);

        // Return sequence.
        return deferred.promise();
      }

      // Get id of the button pressed.
      var id = $(this).attr("id");

      // Get the colour of the button pressed.
      var colour = id.split("-").slice(-1)[0];

      // Execute animations.
      var promise = btnAnimations(this, colour);

      // When actions are done, run this function.
      promise.done(function() {
        console.log("button animation done");
      });
    })
  };







  // Global variables.
  power = false;
  strict = false;
  computerSequence = [];
  userSequence = [];
  currentRound = 0;






});
