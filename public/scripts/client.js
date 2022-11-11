/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function (!!!)
 */

// all code contained within document-ready function
$(document).ready(function() {

  // escape function to protect against cross-site scripting
  const escape = function(string) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(string));
    return div.innerHTML;
  };

  // function to create tweet with HTML article format
  const createTweetElement = function(tweet) {

    let $tweet = `
    <article class="tweet">
      <header>
        <div class="tweet-avatar"><img src="${tweet.user.avatars}"> ${tweet.user.name}</div>
        <div class="tweet-handle">${tweet.user.handle}</div>
      </header>
      <p>${escape(tweet.content.text)}</p>
      <footer>
        <div class="tweet-date">${timeago.format(tweet.created_at)}</div>
        <div class="tweet-icons">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </footer>
    </article>
    `;
  
    return $tweet;
  };
  
  // tweet renderer app, making use of createTweetElement above
  const renderTweets = function(tweetArray) { // array of tweet objects

    $('#tweet-list').empty(); // clear previous list whenever function is called, otherwise list will duplicate

    for (const tweet of tweetArray) {
      const $newTweet = createTweetElement(tweet);
      $('#tweet-list').prepend($newTweet);
    }
  };

  // ajax function to load/reload tweet database and render it
  const loadTweets = function() {

    $.ajax('/tweets', {method: 'GET'})
      .then(function(allTweets) {
        renderTweets(allTweets);
      });

  };
  
  // helper function for error conditions. takes in custom error message
  const errorSlide = function(message) {

    $('.error-message').text(message ? message : null); // if no error message has been set, removes any previous error message

    if (!message) { // if no message has been set (happy-path condition), slides up error message box.
      return  $('#tweet-error').slideUp('slow');
    }
    
    $('#tweet-error').hide(); // if multiple errors happen in succession, this hide & slideDown ensures new error message is presented for each error.
    $('#tweet-error').slideDown({ // not the simplest syntax, but had to find something to get around slideDown having display: block style as default
      start: function() {
        $(this).css({
          display: 'flex'
        });
      },
      duration: 'slow'});
  };

  // tweet form submitter
  $('form').submit(function(event) {
    const tweetInput = this.children[1].value;
    event.preventDefault();

    if (!tweetInput) {
      errorSlide("Too short! please enter a message to post.");
      
    }  else if (tweetInput.length > 140) {
      errorSlide("Too long! please respect the 140 character limit.");

    } else { // happy path
      errorSlide(); // sets message to null and slides up

      const newText = $(this).serialize();
      $.ajax({
        type: 'POST',
        url: '/tweets/',
        data: newText
      })
        .then(() => loadTweets())   // secondary tweet database loading after new submission
        .catch((error) => console.log("error: ", error));
      this.reset();
    }
  });

  // primary tweet database loading
  loadTweets();
});