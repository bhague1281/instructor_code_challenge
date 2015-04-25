(function(){
  // event listener for the input field
  document.querySelector('form').addEventListener('submit', function(event){
    // prevent the default submit action and create a request using the given input
    event.preventDefault();
    var input = document.querySelector('input').value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://omdbapi.com/?s=' + encodeURIComponent(input), true);

    xhr.addEventListener('load', function(response) {
      // clear existing items from results and check if any results are found
      document.clearListItems('#results');
      var res =  JSON.parse(this.response);

      if (res.Response !== 'False') {
        // get results from successful response
        res = res.Search;

        // loop through the response and list results
        for(var i = 0; i < res.length; ++i) {
          // create movie title, detail button, and favorite elements
          var movieTitle = document.createMovieTitleElement(res[i].Title);
          var detailButton = document.createMovieDetailButton(res[i].imdbID);
          var favoriteButton = document.createMovieFavoriteButton(res[i].Title, res[i].imdbID);

          // append movie title and buttons to a container
          var container = document.createElement('div');
          container.appendChild(movieTitle);
          container.appendChild(detailButton);
          container.appendChild(favoriteButton);

          // append container to list item
          var node = document.createElement('li');
          node.appendChild(container);

          //append list item to results list
          document.querySelector('#results').appendChild(node);
        }
      } else {
        // display message that no results were found
        document.createListItemAndAppend('No results found', '#results');
      }
    });
    xhr.send();
  });

  document.addMovieToFavorites = function(movieName, movieID) {
    // send request to add a movie to favorites
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/favorites/add?name=' + encodeURIComponent(movieName) + '&oid=' + encodeURIComponent(movieID));
    
    xhr.addEventListener('load', function(response) {
      // display a success/failure message depending if the request was successful
      if (this.responseText !== 'Invalid Request') {
        alert('Successfully added "' + movieName + '" to your favorites.');
      } else {
        alert('A problem occurred when adding this movie. Try again.');
      }
    });
    xhr.send();
  };

  document.viewFavorites = function() {
    // create a request to receive list of favorites
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/favorites', true);

    xhr.addEventListener('load', function(response) {
      document.clearListItems('#favorites');

      // if items are available
      if (this.response) {
        favorites = JSON.parse(this.response).data;

        for(var i = 0; i < favorites.length; i++){
          // create favorite item and detail button
          var favoriteItem = document.createMovieTitleElement(favorites[i].name);
          var detailButton = document.createMovieDetailButton(favorites[i].oid);

          // append favorite item and detail button to container
          var container = document.createElement('div');
          container.appendChild(favoriteItem);
          container.appendChild(detailButton);

          // append container to list item
          var node = document.createElement('li');
          node.appendChild(container);

          //append list item to results list
          document.querySelector('#favorites').appendChild(node);
        }
      } else {
        // display message that no favorites are available
        document.createListItemAndAppend('No favorites available', '#favorites');
      }
    });
    xhr.send();
  };

  document.showMovieDetails = function(imdbID) {
    // create a request to receive list of movie details
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'http://omdbapi.com/?i=' + encodeURIComponent(imdbID), true);

    xhr.addEventListener('load', function(response){
      document.clearListItems('#details');

      // if details are available
      if (this.response) {
        var details =  JSON.parse(this.response);
        
        for(var property in details) {
          // create list item for each detail
          if (details.hasOwnProperty(property) && property !== 'Type' && property !== 'Response') {
            detailText = '<strong>' + property + ': </strong>' + details[property];
            document.createListItemAndAppend(detailText, '#details');
          }
        }
      } else {
        // display message that no details are available
        document.createListItemAndAppend('No details available', '#details');
      }
    });
    xhr.send();
  };

  // create movie title element (paragraph)
  document.createMovieTitleElement = function(movieTitle) {
    var title = document.createElement('p');
    title.innerText = movieTitle;

    return title;
  };

  // create movie detail button; calls showMovieDetails on click
  document.createMovieDetailButton = function(imdbID) {
    var detailButton = document.createElement('button');
    detailButton.setAttribute('onclick', 'showMovieDetails("' + imdbID + '");');
    detailButton.innerText = 'Details';

    return detailButton;
  };

  // create movie favorite button; calls addMovieToFavorites on click
  document.createMovieFavoriteButton = function(movieTitle, imdbID) {
    var favoriteButton = document.createElement('button');
    favoriteButton.setAttribute('onclick', 'addMovieToFavorites("' + movieTitle + '","' + imdbID + '");');
    favoriteButton.innerText = 'Favorite';

    return favoriteButton;
  };

  //create list item with text and append to a selector
  document.createListItemAndAppend = function(contents, selectorToAppendTo) {
    var node = document.createElement('li');
    node.innerHTML = contents;
    document.querySelector(selectorToAppendTo).appendChild(node);
  };

  // clear list items by setting the innerHTML to an empty string
  document.clearListItems = function(listSelector) {
    document.querySelector(listSelector).innerHTML = '';
  };
})();
