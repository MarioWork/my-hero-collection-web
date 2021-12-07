var posterImgPrefix = 'https://image.tmdb.org/t/p/w300';
var backdropImgPrefix = 'https://image.tmdb.org/t/p/original';

import apiKey from "./secrets.js";

$(document).ready(function() {
    getUpcomingMovies();
    getReleaseMovies();

    var backbutton = $('#back-button');
    backbutton.click(goBack);
});

function initMovieOverview(event) {
    var movieID = getMovieIDfromCard($(event.target));
    getMovieOverview(movieID);
    getMovieOverviewActors(movieID);
}

//HTTP request Functions

function getReleaseMovies() {
    // start the AJAX request
    var url = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey + '&sort_by=primary_release_date.desc&page=1&primary_release_date.lte=' + getDateString() + '&with_companies=420';
    //console.log('Realased Movies: ' + url);

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
    populateCards(response.results, releaseContainer, 'released');
}

function errorCallback(request, status, error) {
    console.log(status + error);
}

function getUpcomingMovies() {
    // start the AJAX request
    var url = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey + '&sort_by=primary_release_date.asc&page=1&primary_release_date.gte=' + getDateString() + '&with_companies=420';
    //console.log('Upcoming Movies: ' + url);

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
    //console.log("Movie Overview Actors: "+url);

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
    //console.log("Movie Overview: " + url);

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
        var cardDiv = $("<div></div>");
        cardDiv.id = "cardDiv";
        cardDiv.attr('class', 'col-12 col-lg-2 card shadow-sm p-3 mb-5 bg-body rounded me-5');
        cardDiv.attr('id', 'cardDiv')
        cardDiv.css('cursor', 'pointer');
        cardDiv.click(initMovieOverview);


        var cardImg = $("<img/>");
        cardImg.attr('src', posterImgPrefix + item.poster_path);
        cardImg.attr('class', 'card-img');
        cardImg.attr('alt', 'Movie Poster');
        cardDiv.append(cardImg);

        var cardBodyDiv = $("<div></div>");
        cardBodyDiv.attr('class', 'card-body');
        cardDiv.append(cardBodyDiv);

        var movieTitle = $("<p></p>");
        movieTitle.text(item.title);
        movieTitle.attr('class', 'h5 h-50');
        cardBodyDiv.append(movieTitle);

        var movieID = $("<p></p>");
        movieID.text(item.id);
        movieID.attr('class', 'd-none');
        movieID.attr('id', 'movieID');
        cardBodyDiv.append(movieID);

        if (listType === 'upcoming') {
            var releaseDate = $("<p></p>");
            releaseDate.text(convertDateFormat(item.release_date));
            releaseDate.attr('class', 'h6 h-50 d-flex align-items-end');
            cardBodyDiv.append(releaseDate);
        }

        parentElement.append(cardDiv);
    });
}

function populateMovieOverview(data) {
    $($('#backgroundImage')[0]).attr('src', backdropImgPrefix + data.backdrop_path);;
    $($('#posterOverview')[0]).attr('src', posterImgPrefix + data.poster_path);
    $($('#movieTitle')[0]).text(data.original_title);
    $($('#movieOverview')[0]).text(data.overview);
    $($('#movieDate')[0]).text(convertDateFormat(data.release_date));

    var genres = '';
    data.genres.forEach(item => {
        genres += item.name + ', ';
    });

    $($('#movieGenres')[0]).text(genres);

}

function populateMovieOverviewActors(data, parentElement) {

    data.forEach(item => {
        var cardDiv = $("<div></div>");
        cardDiv.attr('id', 'cardDiv');
        cardDiv.attr('class', 'col-12 col-lg-2 card shadow-sm p-3 mb-5 bg-body rounded me-5');

        var actorName = $("<p></p>");
        actorName.text(item.name);
        actorName.attr('class', 'h5 h-50 fw-bold');
        cardDiv.append(actorName);

        var cardImg = $("<img/>");
        cardImg.css('object-fit', 'contain');
        cardImg.attr('class', 'card-img');
        cardImg.attr('src', posterImgPrefix + item.profile_path);
        cardImg.attr('alt', 'Actor Image');
        cardDiv.append(cardImg);

        var cardBodyDiv = $("<div></div>");
        cardBodyDiv.attr('class', 'card-body');
        cardDiv.append(cardBodyDiv);

        var actorCharacter = $("<p></p>");
        actorCharacter.text(convertDateFormat(item.character));
        actorCharacter.attr('class', 'h6 h-50 d-flex align-items-end');
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
        if ($(target).attr('id') === "cardDiv") {
            break;
        }

        target = $(target).parent();
    }

    var movieID = $($($(target).children()[1]).children()[1]).text();
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