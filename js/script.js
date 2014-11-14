
function loadData(){
  var body = $('body');
  var wikiElem = $('#wikipedia-links');
  var nytHeaderElem = $('#nytimes-header');
  var nytElem = $('#nytimes-articles');
  var greeting = $('#greeting');

  // clear out old data before new request
  wikiElem.text("");
  nytElem.text("");

  var addressInput = $('#street').val();
  var cityInput = $('#city').val();
  var address = addressInput + ', ' + cityInput;

  greeting.text('So, you want to live at ' + address + '?');

  var bgImgURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';

  body.append('<img class="bgimg" src="' + bgImgURL +'">');

  //NYT article request

  $nytURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityInput + "&sort=newest&api-key=9adb03db1d036d35cd7286068b6ef82e:11:70184197";
  //get JSON and load NYT articles as <li>s to DOM
  $.getJSON($nytURL, function(data){
    nytHeaderElem.text = "New York Times articles about " + cityInput;
    articles = data.response.docs;
    for(var i = 0; i < articles.length; i++){
        var article = articles[i];
        nytElem.append("<li id='article'>" + '<a href=' + article.web_url + '>' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
    };
    //Error Handling
  }).error(function(e){
    $(nytHeaderElem).text("The Article Could Not Be Displayed");
  });

  //Wikipedia request

  var wikiURL = "http://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=" + cityInput + "&format=json&callback=wikiCallback";
  //No error handling so 5 sec timeout on AJAX request
  var wikiTimeOut = setTimeout(function(){
    wikiElem.text("Failed to load articles");
  }, 5000);
  
  //json-p AJAX call load wiki articles as <li>s to DOM
  $.ajax(wikiURL,{
    dataType: 'jsonp',
    //callback
    success: function(response){
      var articleList = response[1];
      for(var i = 0; i < articleList.length; i++){
        articleStr = articleList[i];
        var wiki = "http://en.wikipedia.org/wiki/" + articleStr;
        wikiElem.append("<li><a href ='" + wiki + "'>" + articleStr + '</a></li>');
      };
    }
  });

  return false;


}

$('#form-container').submit(loadData);