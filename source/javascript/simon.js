$(document).ready(function() {
  /*
  // Button click.
  $(".btn").on("click", function() {


    if (id === "green") {
      inactiveClass = "btn-green-inactive";
      activeClass = "btn-green-active";
    } else if (id === "red") {
      inactiveClass = "btn-red-inactive";
      activeClass = "btn-red-active";
    } else if (id === "yellow") {
      inactiveClass = "btn-yellow-inactive";
      activeClass = "btn-yellow-active";
    } else {
      inactiveClass = "btn-blue-inactive";
      activeClass = "btn-blue-active";
    }

    $(this).mousedown(function() {console.log(activeClass);});
    $(this).mouseup(function() {console.log(inactiveClass);});

  });
  */

  /*
  $(".btn").mousedown(function() {

    // Get the colour of the button which was just pressed.
    var btnColour = $(this).attr("id").split("-")[1];

    console.log(btnColour);
  });

  $(".btn").mouseup(function() {console.log("inactive");});
  */

  $(".btn").on("click", function() {
    $(this).removeClass("btn-green-inactive");
    $(this).addClass("btn-green-active");

    $(this).removeClass("btn-green-active");
        $(this).addClass("btn-green-inactive");
  });



});
