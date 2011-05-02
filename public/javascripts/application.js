var updateTweetsPeriodically = function(){
  var interval = 60 * 1000;
  window.setInterval(function(){
    var id = $(".tweets li").get(0).id;
    $.ajax({
      url: "tweet/update_remote/",
      data: "id=" + id,
      success: function(html){
        $(".tweets ul").prepend(html);
      }
    });
  }, interval);
};

$(function(){
  updateTweetsPeriodically();

  // focus tweet-box
  var tweetBox = $(".tweetBox textarea");
  tweetBox.focus();

  // countup tweet-box
  $(".tweetBox textarea").keyup(function(){
    var counter = $(this).val().length;
    $("#countUp").text(counter);
    if (counter == 0) {
      $("#countUp").text("0");
    } else if (counter >= 140) {
      $("#countUp").css("color","red");
    } else {
      $("#countUp").css("color","#666");
    }
  });

  // RT & Reply
  var moveToTweetBox = function(){
    $('html,body').animate({ scrollTop: $("#header").offset().top }, 'slow','swing');
    window.setTimeout(function(){ tweetBox.focus(); }, 1000);
  };
  $(".tweet").each(function(){
    var text = $(this).find(".body").text();
    var user = $(this).find(".user a").text();
    $(this).find(".retweet").click(function(){
      tweetBox.text("RT @" + user + " " + text);
      moveToTweetBox();
      tweetBox.get(0).setSelectionRange(0, 0);
    });
    $(this).find(".reply").click(function(){
      tweetBox.text("@" + user + " ");
      moveToTweetBox();
      var textLength = tweetBox.text().length;
      tweetBox.get(0).setSelectionRange(textLength, textLength);
    });
  });

});

