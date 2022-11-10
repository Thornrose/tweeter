/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function (!!!)
 */

$(document).ready(function() {

  const createTweetElement = function(tweet) {
    let $tweet = `
    <article class="tweet">
      <header>
        <div class="tweet-avatar"><img src="${tweet.user.avatars}"> ${tweet.user.name}</div>
        <div class="tweet-handle">${tweet.user.handle}</div>
      </header>
      <p>${tweet.content.text}</p>
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
    $('#tweet-list').empty();
    for (const tweet of tweetArray) {
      const $newTweet = createTweetElement(tweet);
      $('#tweet-list').prepend($newTweet);
    }
  };

  const loadTweets = function() {
    $.ajax('/tweets', {method: 'GET'})
    .then(function (allTweets) {
      renderTweets(allTweets);
    });
  };

  

  $('form').submit(function(event) {
    event.preventDefault();
    const tweetInput = this.children[1].value;
    if (!tweetInput) {
      alert("empty submission!");
    } else if (tweetInput.length > 140) {
      alert("tweet is too long!")
    } else {

      const newText = $(this).serialize();
      $.ajax({
        type: 'POST',
        url: '/tweets/',
        data: newText
      })
      .then(() => loadTweets())
      .catch((error) => console.log("error: ", error));
      this.reset();
    }


   // $('#container').load('/tweets/');

  });

  loadTweets();

});