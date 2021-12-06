var posterImgPrefix = 'https://image.tmdb.org/t/p/w300';
var backdropImgPrefix = 'https://image.tmdb.org/t/p/original';
import apiKey from "./secrets.js";
apiKey = process.env.API_KEY;
console.log(apiKey);
$(document).ready(function() {
    getUpcomingMovies();
    getReleaseMovies();

    var backbutton = document.getElementById('back-button');
    backbutton.addEventListener('click', goBack);
});

function initMovieOverview(event) {
    var movieID = getMovieIDfromCard(event.target);
    getMovieOverview(movieID);
    getMovieOverviewActors(movieID);
}

//HTTP request Functions

function getReleaseMovies() {
    // start the AJAX request
    var url = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey + '&sort_by=primary_release_date.desc&page=1&primary_release_date.lte=' + getDateString() + '&with_companies=420';
    console.log('Realased Movies: ' + url);

    // perform an ajax http get request
    $.ajax({
        url: url,
        async: true,
        success: successReleasedMoviesCallback,
        error: errorCallback
    });
}

function successReleasedMoviesCallback(response) {
    var releaseContainer = $('#released-cards-container');
    populateCards(response.results, releaseContainer, 'release');
}

function errorCallback(request, status, error) {
    console.log(status + error);
}

function getUpcomingMovies() {
    // start the AJAX request
    var url = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey + '&sort_by=primary_release_date.asc&page=1&primary_release_date.gte=' + getDateString() + '&with_companies=420';
    console.log('Upcoming Movies: ' + url);

    // perform an ajax http get request
    $.ajax({
        url: url,
        async: true,
        success: successUpcomingMoviesCallback,
        error: errorCallback
    });
}

function successUpcomingMoviesCallback(response) {
    var upcomingContainer = $('#upcoming-movies-cards-container');
    populateCards(response.results, upcomingContainer, 'upcoming');
}

function getMovieOverviewActors(movieID) {
    var url = 'https://api.themoviedb.org/3/movie/' + movieID + '/credits?api_key=' + apiKey;

    // perform an ajax http get request
    $.ajax({
        url: url,
        async: true,
        success: successMovieOverviewActorsCallback,
        error: errorCallback
    });
}

function successMovieOverviewActorsCallback(response) {
    var castContainer = $('#movie-cast-container');
    populateMovieOverviewActors(response.cast, castContainer);
}

function getMovieOverview(movieID) {


    var url = 'https://api.themoviedb.org/3/movie/' + movieID + '?api_key=' + apiKey;

    // perform an ajax http get request
    $.ajax({
        url: url,
        async: true,
        success: sucessMovieOverviewCallback,
        error: errorCallback
    });
}

function sucessMovieOverviewCallback(response) {
    populateMovieOverview(response);

    var cardsContainer = $('#cards')[0];
    cardsContainer.style.display = 'none';
    var movieContainer = $('#movie-overview')[0];
    movieContainer.style.display = "block";
}


//Populate HTML functions

function populateCards(data, parentElement, listType) {
    data.forEach(item => {
        var cardDiv = document.createElement("div");
        cardDiv.id = "cardDiv";
        cardDiv.classList.add('col-12', 'col-lg-2', 'card', 'shadow-sm', 'p-3', 'mb-5', 'bg-body', 'rounded', 'me-5');
        cardDiv.style = "cursor:pointer;"
        cardDiv.addEventListener('click', initMovieOverview);


        var cardImg = document.createElement("img");
        cardImg.src = posterImgPrefix + item.poster_path;
        cardImg.classList.add('card-img');
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
    var movieBackgroundImg = $('#backgroundImage')[0];
    var posterOverview = $('#posterOverview')[0];
    var movieTitle = $('#movieTitle')[0];
    var movieOverview = $('#movieOverview')[0];
    var movieDate = $('#movieDate')[0];
    var movieGenres = $('#movieGenres')[0];

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
        cardImg.classList.add("card-img");
        cardImg.src = posterImgPrefix + item.profile_path;
        cardImg.alt = 'Actor Image';
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
    window.location.href = "";
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

function getDateString() {
    var today = new Date();

    var year = today.getUTCFullYear();
    var month = today.getUTCMonth();
    var day = today.getUTCDate().toString().length == 1 ? "0" + today.getUTCDate() : today.getUTCDate();
    var currentDate = year + "-" + month + "-" + day;

    return currentDate;
}