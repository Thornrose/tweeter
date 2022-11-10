/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function (!!!)
 */

$(document).ready(function() {

  const escape = function(string) { // escape function to protect against cross-site scripting
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(string));
    return div.innerHTML;
  };

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
  

  const renderTweets = function(tweetArray) { // array of tweet objects

    $('#tweet-list').empty(); // clear previous list whenever function is called, otherwise list will duplicate

    for (const tweet of tweetArray) {
      const $newTweet = createTweetElement(tweet);
      $('#tweet-list').prepend($newTweet);
    }

  };


  const loadTweets = function() {

    $.ajax('/tweets', {method: 'GET'})
      .then(function(allTweets) {
        renderTweets(allTweets);
      });

  };

  const errorSlide = function() { // helper function for error conditions. still need it to slide UP afterwards.
    $('#tweet-error').slideDown({
      start: function() {
        $(this).css({
          display: 'flex'
        })
      },
      duration: 'slow'});
  };


  $('form').submit(function(event) {

    const tweetInput = this.children[1].value;
    const errorText = this.previousElementSibling.children[1].innerHTML;

    event.preventDefault();
    if (errorText.length > 0) {
      $('#tweet-error').slideUp('slow');
    } else {
      $('#tweet-error').hide();
    }

    if (!tweetInput) {
      $('.error-message').text("Too short! please enter a message to post.");
      errorSlide();
      
    }  else if (tweetInput.length > 140) {
      $('.error-message').text("Too long! please respect the 140 character limit.");
      errorSlide();

     } else { // happy path



      const newText = $(this).serialize();
      $.ajax({
        type: 'POST',
        url: '/tweets/',
        data: newText
      })
        .then(() => loadTweets())   // secondary tweet loading after new submission
        .catch((error) => console.log("error: ", error));
      this.reset();
    }
    

  });

  loadTweets(); // initial tweet loading

});