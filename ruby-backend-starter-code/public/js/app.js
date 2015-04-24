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
        favoriteButton.innerText = 'Favorite';

        // append movie title and favorite button to list
        document.querySelector('ul').appendChild(node);
        document.querySelector('ul').appendChild(favoriteButton);
      }
  });
    xhr.send();
  });
})();
