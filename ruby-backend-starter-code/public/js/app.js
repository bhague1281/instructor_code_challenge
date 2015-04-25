(function(){

  document.querySelector('form').addEventListener('submit', function(event){
    event.preventDefault();
    var input = document.querySelector('input').value;
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'http://omdbapi.com/?s=' + encodeURIComponent(input), true);
    xhr.addEventListener('load', function(response){
      var res =  JSON.parse(this.response).Search;
      for(var i = 0; i < res.length; i++){
        // create movie title list item
        var node = document.createElement('li');
        node.innerText = res[i].Title;

        // create favorite button
        var favoriteButton = document.createElement('button');
        favoriteButton.setAttribute('data-oid', res[i].imdbID);
        favoriteButton.setAttribute('data-name', res[i].Title);
        favoriteButton.setAttribute('onclick', 'addMovieToFavorites("' + res[i].Title + '","' + res[i].imdbID + '");');
        favoriteButton.innerText = 'Favorite';

        // append movie title and favorite button to list
        document.querySelector('#results').appendChild(node);
        document.querySelector('#results').appendChild(favoriteButton);
      }
  });
    xhr.send();
  });

  document.addMovieToFavorites = function(movieName, movieID) {
    // send request to add a favorite movie
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/favorites/add?name=' + movieName + '&oid=' + movieID);
    xhr.send(null);

    // return whether or not the request was successful by checking the response
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        return xhr.responseText === 'Invalid Request';
      }
    }
  };

  document.viewFavorites = function() {
    // send request to receive list of favorites
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/favorites', true);
    xhr.addEventListener('load', function(response){
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
})();
