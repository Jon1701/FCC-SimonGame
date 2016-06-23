$(document).ready(function() {

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

    // Update LCD.
    setLCD(currentRound);

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

        // Play audio.
        playAudio(colour);

      }, (index+1)*1200 + 1000*index);

      // Button inactive.
      setTimeout(function() {

        // Sets appropriate inactive class according to its colour.
        $("#btn-" + colour).removeClass("btn-" + colour + "-active");

        // Resolve this promise.
        promise.resolve();

      }, (index+1)*2200);

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
  // Records the sequence from the user.
  //////////////////////////////////////////////////////////////////////////////

  var recordSequence = function() {

    $(".btn").on("click", function() {

      // A sequence of buttion animations to be performed.
      var btnAnimations = function(btn, colour) {

        // Create a deferred sequence of actions.
        var deferred = $.Deferred();

        // Set button to active.
        setTimeout(function() {

          //Add its appropriate active class.
          $(btn).addClass("btn-" + colour + "-active");

          // Play audio.
          playAudio(colour);

        }, 0);

        // Set button to inactive.
        setTimeout(function() {

          // Remove its appropriate active class.
          $(btn).removeClass("btn-" + colour + "-active");

          // Deferred actions are done.
          deferred.resolve();
        }, 450);

        // Return sequence.
        return deferred.promise();
      } // end button animations.

      // Checks to see if two arrays have the same elements.
      var arraysEqual = function(arr1, arr2) {

        // Join characters in each array together as strings.
        arr1String = arr1.join();
        arr2String = arr2.join();

        // Check if the two strings are the same.
        return arr1String === arr2String;

      }

      // Get id of the button pressed.
      var id = $(this).attr("id");

      // Get the colour of the button pressed.
      var colour = id.split("-").slice(-1)[0];

      // Animate the button pressed.
      // Add the colour to the userSequence array.
      btnAnimations(this, colour);
      userSequence.push(colour);

      // Logic to check user sequence.
      //
      // If both sequences match, the next round begins.
      // If both sequences do not match:
      //  a) if Strict Mode is disabled, the user is given a chance to try again.
      //  b) if Strict Mode is enabled, the user is not given a chance to try
      //     again, and must start from the very beginning (round 1).
      //
      // First, check to see if both patterns have the same length.
      //    If the lengths are the same, check if the sequences are the same.
      //    If they are, go to next round, if not, continue/restart depending on
      //    Strict mode.
      //
      //    If the lengths are not the same, keep adding colours to userSequence.
      if (computerSequence.length === userSequence.length) {

        if (arraysEqual(computerSequence, userSequence)) {

          // Both sequences are the same, the user is allowed to continue to
          // next round.

          // Show the mask.
          showMask();

          // New sequence.
          generateSequence();

          // Play sequence.
          playSequence();

        } else {

          // Both sequences are incorrect.

          // Check if Strict Mode is enabled.
          if (strict) {

            // If Strict Mode is enabled, clear their sequence, and start from
            // the very beginning.

            // Prevent button press.
            showMask();

            // Clear user sequence.
            userSequence = [];

            // Set current round to 0.
            currentRound = 0;

            // Blink LCD and restart.
            blinkLCD("!!", function() {
              // Generate sequence.
              generateSequence();

              // Play back sequence.
              playSequence();
            });

          } else {

            // If Strict Mode is not enabled, give user another chance to
            // enter their sequence.

            // Prevent button press
            showMask();

            // Clear user sequence.
            userSequence = [];

            // Blink LCD, allow user input after blinking is done.
            blinkLCD("!!", hideMask);

          }// end Strict Mode check.
        }// end sequence comparison.
      }// end sequence length check.
    }) // end button onclick.
  };

  //////////////////////////////////////////////////////////////////////////////
  // Play audio file based on colour.
  //////////////////////////////////////////////////////////////////////////////
  var playAudio = function(colour) {

    // Play file based on colour.
    if (colour === "green") {
      $("#simon-audio1").trigger("play");
    } else if (colour === "red") {
      $("#simon-audio2").trigger("play");
    } else if (colour === "yellow") {
      $("#simon-audio3").trigger("play");
    } else {
      $("#simon-audio4").trigger("play");
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Hides or shows transparent layer separating the board buttons and the
  // control panel.
  //////////////////////////////////////////////////////////////////////////////
  var showMask = function() { $("#board-mask").show(); };
  var hideMask = function() { $("#board-mask").hide(); };

  //////////////////////////////////////////////////////////////////////////////
  // Sets the LCD value.
  //////////////////////////////////////////////////////////////////////////////
  var setLCD = function(text) {
    $("#lcd").text(text);
  }

  //////////////////////////////////////////////////////////////////////////////
  // Performs a blink animation on the LCD with a given string of text.
  //////////////////////////////////////////////////////////////////////////////
  var blinkLCD = function(text, f) {

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
    promise.done(f);
  }// end blinkLCD().

  //////////////////////////////////////////////////////////////////////////////
  // Toggles the boards Start indicator.
  //////////////////////////////////////////////////////////////////////////////
  var togglePowerIndicator = function() {

    // Check internal state to see if power is turned on.
    if (power) {

      // If internal state is on, board indicator is active.
      $("#btn-start > span").addClass("indicator-start-on");
      $("#btn-start > span").removeClass("indicator-start-off");

    } else {

      // If internal state is off, board indicator is inactive.
      $("#btn-start > span").addClass("indicator-start-off");
      $("#btn-start > span").removeClass("indicator-start-on");

    }
  }// end togglePowerIndicator().

  //////////////////////////////////////////////////////////////////////////////
  // Toggles the boards Strict Mode indicator.
  //////////////////////////////////////////////////////////////////////////////
  var toggleStrictIndicator = function() {

    // Check internal state to see if Strict Mode is turned on.
    if (strict) {

      // If Strict Mode is on, board indicator is on.
      $("#btn-strict > span").addClass("indicator-strict-on");
      $("#btn-strict > span").removeClass("indicator-strict-off");

    } else {

      // If Strict Mode is off, board indicator is off.
      $("#btn-strict > span").addClass("indicator-strict-off");
      $("#btn-strict > span").removeClass("indicator-strict-on");

    }
  }// end toggleStrictIndicator()

  //////////////////////////////////////////////////////////////////////////////
  // Toggles the Start Indicator and internal power state.
  //////////////////////////////////////////////////////////////////////////////
  $("#btn-start").on("click", function() {

    // If internal power state is on, turn the game off.
    if (power) {

      // Just refresh the page.
      location.reload();

    } else { // If the internal power state is off, turn the game on.

      // Set power to on.
      power = true;

      // Toggle Indicator.
      togglePowerIndicator();

      // Allow button press.
      hideMask();

      // Generate sequence.
      generateSequence();

      // Play back sequence.
      playSequence();

      // Records the users button press.
      recordSequence();
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

  // Global variables.
  var power = false;
  var strict = false;
  var computerSequence = [];
  var userSequence = [];
  var currentRound = 0;

  // Audio files.
  var simonSound1 = new Audio("../media/sounds/simonSound1.mp3");
  var simonSound2 = new Audio("../media/sounds/simonSound2.mp3");
  var simonSound3 = new Audio("../media/sounds/simonSound3.mp3");
  var simonSound4 = new Audio("../media/sounds/simonSound4.mp3");

});
