
console.log("composer-char-counter script loaded successfully");


$(document).ready(function() {
  

  $("#tweet-text").on("input", function(event) {

    const maximumCharacters = 140;
    const counterElement = this.nextElementSibling.children[1];

    counterElement.value = maximumCharacters - this.value.length; // instead of accessing 140 directly, this seems like better practice

    if (counterElement.value < 0) {   // if statements to change CSS
      counterElement.classList.add("tweet-invalid");
    }
    if (counterElement.value >= 0) {
      counterElement.classList.remove("tweet-invalid");
    }

  });
  

});

