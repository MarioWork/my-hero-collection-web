var document = window.document;
var posterImgPrefix = 'https://image.tmdb.org/t/p/w300';
var backdropImgPrefix = 'https://image.tmdb.org/t/p/original';

window.onload = function() {
    getUpcomingMovies();
    getReleaseMovies();

    var backbutton = document.getElementById('back-button');
    backbutton.addEventListener('click', goBack);
}


function initMovieOverview(event) {
    var movieID = getMovieIDfromCard(event.target);
    getMovieOverview(movieID);
    getMovieOverviewActors(movieID);
}

//HTTP request Functions

function getReleaseMovies() {
    var ajax;

    if (window.XMLHttpRequest) {
        // Mozilla, Safari, IE7+ ...
        ajax = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        // IE 6 and older
        ajax = new ActiveXObject('Microsoft.XMLHTTP');
    }

    // run this when the ajax request completes
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4 && ajax.status === 200) {
            var response = JSON.parse(ajax.responseText);
            var releaseContainer = document.getElementById('released-cards-container');
            populateCards(response.results, releaseContainer, 'release');;
        }
    };


    // start the AJAX request
    var url = 'https://api.themoviedb.org/3/discover/movie?api_key=757c7295e046a99dc60a8a55b58970b9&sort_by=primary_release_date.desc&page=1&primary_release_date.lte=' + getDateString() + '&with_companies=420';
    console.log('Realased Movies: ' + url);
    ajax.open('GET', url, true);
    ajax.setRequestHeader('Content-type', 'application/json');
    ajax.send();
}

function getUpcomingMovies() {
    var ajax;

    if (window.XMLHttpRequest) {
        // Mozilla, Safari, IE7+ ...
        ajax = new XMLHttpRequest();
    } else
    if (window.ActiveXObject) {
        // IE 6 and older
        ajax = new ActiveXObject('Microsoft.XMLHTTP');
    }

    // run this when the ajax request completes
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4 && ajax.status === 200) {
            var response = JSON.parse(ajax.responseText);
            var upcomingContainer = document.getElementById('upcoming-movies-cards-container');
            populateCards(response.results, upcomingContainer, 'upcoming');
        }
    };


    // start the AJAX request
    var url = 'https://api.themoviedb.org/3/discover/movie?api_key=757c7295e046a99dc60a8a55b58970b9&sort_by=primary_release_date.asc&page=1&primary_release_date.gte=' + getDateString() + '&with_companies=420';
    console.log('Upcoming Movies: ' + url);
    ajax.open('GET', url, true);
    ajax.setRequestHeader('Content-type', 'application/json');
    ajax.send();
}

function getDateString() {
    var today = new Date();

    var year = today.getUTCFullYear();
    var month = today.getUTCMonth();
    var day = today.getUTCDate().toString().length == 1 ? "0" + today.getUTCDate() : today.getUTCDate();
    var currentDate = year + "-" + month + "-" + day;

    return currentDate;
}

function getMovieOverviewActors(movieID) {
    var ajax;

    if (window.XMLHttpRequest) {
        // Mozilla, Safari, IE7+ ...
        ajax = new XMLHttpRequest();
    } else
    if (window.ActiveXObject) {
        // IE 6 and older
        ajax = new ActiveXObject('Microsoft.XMLHTTP');
    }

    // run this when the ajax request completes
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4 && ajax.status === 200) {
            var response = JSON.parse(ajax.responseText);
            var castContainer = document.getElementById('movie-cast-container');
            populateMovieOverviewActors(response.cast, castContainer);
        }
    };


    // start the AJAX request
    var url = 'https://api.themoviedb.org/3/movie/' + movieID + '/credits?api_key=757c7295e046a99dc60a8a55b58970b9';
    console.log('Movie Actors: ' + url);
    ajax.open('GET', url, true);
    ajax.setRequestHeader('Content-type', 'application/json');
    ajax.send();
}

function getMovieOverview(movieID) {
    //Request movie details
    var ajax;

    if (window.XMLHttpRequest) {
        // Mozilla, Safari, IE7+ ...
        ajax = new XMLHttpRequest();
    } else
    if (window.ActiveXObject) {
        // IE 6 and older
        ajax = new ActiveXObject('Microsoft.XMLHTTP');
    }

    // run this when the ajax request completes
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4 && ajax.status === 200) {
            var response = JSON.parse(ajax.responseText);
            populateMovieOverview(response);

            var cardsContainer = document.getElementById('cards');
            cardsContainer.style.display = 'none';
            var movieContainer = document.getElementById('movie-overview');
            movieContainer.style.display = "block";
        }
    };


    // start the AJAX request
    var url = 'https://api.themoviedb.org/3/movie/' + movieID + '?api_key=757c7295e046a99dc60a8a55b58970b9';
    console.log('Movie Overview: ' + url);
    ajax.open('GET', url, true);
    ajax.setRequestHeader('Content-type', 'application/json');
    ajax.send();
}


//Populate HTML functions

function populateCards(data, parentElement, listType) {
    data.forEach(item => {
        var cardDiv = document.createElement("div");
        cardDiv.id = "cardDiv";
        cardDiv.classList.add('col-12', 'col-lg-2', 'card', 'shadow-sm', 'p-3', 'mb-5', 'bg-body', 'rounded', 'me-5');
        cardDiv.addEventListener('click', initMovieOverview);


        var cardImg = document.createElement("img");
        cardImg.src = posterImgPrefix + item.poster_path;
        cardImg.alt = 'Movie Poster';
        cardDiv.append(cardImg);

        var cardBodyDiv = document.createElement("div");
        cardBodyDiv.classList.add("card-body");
        cardDiv.append(cardBodyDiv);

        var movieTitle = document.createElement("p");
        movieTitle.innerHTML = item.title;
        movieTitle.classList.add("h5", "h-50");
        cardBodyDiv.append(movieTitle);

        var movieID = document.createElement("p");
        movieID.innerHTML = item.id;
        movieID.classList.add("d-none");
        movieID.id = "movieID";
        cardBodyDiv.append(movieID);

        if (listType === 'upcoming') {
            var releaseDate = document.createElement("p");
            releaseDate.innerHTML = convertDateFormat(item.release_date);
            releaseDate.classList.add("h6", "h-50", "d-flex", "align-items-end");
            cardBodyDiv.append(releaseDate);
        }

        parentElement.append(cardDiv);
    });
}

function populateMovieOverview(data) {
    var movieBackgroundImg = document.getElementById('backgroundImage');
    var posterOverview = document.getElementById('posterOverview');
    var movieTitle = document.getElementById('movieTitle');
    var movieOverview = document.getElementById('movieOverview');
    var movieDate = document.getElementById('movieDate');
    var movieGenres = document.getElementById('movieGenres');

    movieBackgroundImg.src = backdropImgPrefix + data.backdrop_path;
    posterOverview.src = posterImgPrefix + data.poster_path;
    movieTitle.innerHTML = data.original_title;
    movieOverview.innerHTML = data.overview;
    movieDate.innerHTML = convertDateFormat(data.release_date);

    var genres = '';
    data.genres.forEach(item => {
        genres += item.name + ', ';
    });

    movieGenres.innerHTML = genres;

}

function populateMovieOverviewActors(data, parentElement) {
    data.forEach(item => {
        var cardDiv = document.createElement("div");
        cardDiv.id = "cardDiv";
        cardDiv.classList.add('col-12', 'col-lg-2', 'card', 'shadow-sm', 'p-3', 'mb-5', 'bg-body', 'rounded', 'me-5');

        var actorName = document.createElement("p");
        actorName.innerHTML = item.name;
        actorName.classList.add("h5", "h-50", "fw-bold");
        cardDiv.append(actorName);

        var cardImg = document.createElement("img");
        cardImg.style = "object-fit:contain;"
        cardImg.src = posterImgPrefix + item.profile_path;
        cardImg.alt = 'Movie Poster';
        cardDiv.append(cardImg);

        var cardBodyDiv = document.createElement("div");
        cardBodyDiv.classList.add("card-body");
        cardDiv.append(cardBodyDiv);

        var actorCharacter = document.createElement("p");
        actorCharacter.innerHTML = convertDateFormat(item.character);
        actorCharacter.classList.add("h6", "h-50", "d-flex", "align-items-end");
        cardBodyDiv.append(actorCharacter);

        parentElement.append(cardDiv);
    });
}



//Util Functions

function goBack() {
    var cardsContainer = document.getElementById('cards');
    cardsContainer.style.display = 'block';
    var movieContainer = document.getElementById('movie-overview');
    movieContainer.style.display = "none";
}

function convertDateFormat(str) {
    var formatedStr = str.replace(/^(\d+)-(\d+)-(\d+)$/, '$3-$2-$1');
    return formatedStr;
}

function getMovieIDfromCard(target) {


    //Find the parent cardDiv
    while (true) {
        if (target.id == "cardDiv") {
            break;
        }

        target = target.parentElement;
    }

    var movieID = target.children[1].children[1].innerHTML;
    return movieID;
}