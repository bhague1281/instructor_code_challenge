(function(){

  document.querySelector('form').addEventListener('submit', function(event){
    event.preventDefault();
    var input = document.querySelector('input').value;
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'http://omdbapi.com/?s=' + encodeURIComponent(input), true);

    xhr.addEventListener('load', function(response){
      var res =  JSON.parse(this.response).Search;
      document.clearListItems('#results');

      for(var i = 0; i < res.length; i++){
        // create movie title list item
        var node = document.createElement('li');
        node.innerText = res[i].Title;

        // create movie detail button
        var detailButton = document.createElement('button');
        detailButton.setAttribute('onclick', 'showMovieDetails("' + res[i].imdbID + '");');
        detailButton.innerText = 'Details';

        // create favorite button
        var favoriteButton = document.createElement('button');
        favoriteButton.setAttribute('onclick', 'addMovieToFavorites("' + res[i].Title + '","' + res[i].imdbID + '");');
        favoriteButton.innerText = 'Favorite';

        // append movie title and favorite button to list
        document.querySelector('#results').appendChild(node);
        document.querySelector('#results').appendChild(detailButton);
        document.querySelector('#results').appendChild(favoriteButton);
      }
    });
    xhr.send();
  });

  document.addMovieToFavorites = function(movieName, movieID) {
    // send request to add a favorite movie
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/favorites/add?name=' + encodeURIComponent(movieName) + '&oid=' + encodeURIComponent(movieID));
    
    xhr.addEventListener('load', function(response){
      return this.responseText === 'Invalid Request';
    });
    xhr.send();
  };

  document.viewFavorites = function() {
    // send request to receive list of favorites
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/favorites', true);

    xhr.addEventListener('load', function(response){
      document.clearListItems('#favorites');

      if (this.response) {
        favorites = JSON.parse(this.response).data;

        for(var i = 0; i < favorites.length; i++){
          // create favorite item
          var node = document.createElement('li');
          node.innerText = favorites[i].name;

          // append movie title and favorite button to list
          document.querySelector('#favorites').appendChild(node);
        }
      } else {
        // display message that no favorites are available
        var node = document.createElement('li');
        node.innerText = 'No favorites available';
        document.querySelector('#favorites').appendChild(node);
      }
    });
    xhr.send();
  };

  document.showMovieDetails = function(imdbID) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'http://omdbapi.com/?i=' + encodeURIComponent(imdbID), true);

    xhr.addEventListener('load', function(response){
      document.clearListItems('#details');

      if (this.response) {
        var details =  JSON.parse(this.response);
        
        for(var property in details){
          // create list item for each detail
          if (details.hasOwnProperty(property) && property !== 'Type' && property !== 'Response') {
            var node = document.createElement('li');
            node.innerHTML = '<strong>' + property + ': </strong>' + details[property];
            document.querySelector('#details').appendChild(node);
          }
        }
      } else {
        var node = document.createElement('li');
        node.innerHTML = 'No details available';
        document.querySelector('#details').appendChild(node);
      }
    });
    xhr.send();
  };

  // clear list items by setting the innerHTML to an empty string
  document.clearListItems = function(listSelector) {
    document.querySelector(listSelector).innerHTML = '';
  }
})();
