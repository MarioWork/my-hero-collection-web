var document = window.document;
var imgPrefix = 'https://image.tmdb.org/t/p/w300';

window.onload = function() {
    getUpcomingMovies();
    getReleaseMovies();
}

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
            populate(response.results, releaseContainer, 'release');;
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
            populate(response.results, upcomingContainer, 'upcoming');
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

function populate(data, parentElement, listType) {
    data.forEach(item => {
        var cardDiv = document.createElement("div");
        cardDiv.classList.add('col-12', 'col-lg-2', 'card', 'shadow-sm', 'p-3', 'mb-5', 'bg-body', 'rounded', 'me-5');

        var cardImg = document.createElement("img");
        cardImg.src = imgPrefix + item.poster_path;
        cardImg.alt = 'Movie Poster';
        cardDiv.append(cardImg);

        var cardBodyDiv = document.createElement("div");
        cardBodyDiv.classList.add("card-body");
        cardDiv.append(cardBodyDiv);

        var movieTitle = document.createElement("p");
        movieTitle.innerHTML = item.original_title;
        movieTitle.classList.add("h5", "h-50");
        cardBodyDiv.append(movieTitle);

        if (listType === 'upcoming') {
            var releaseDate = document.createElement("p");
            var x = item.release_date.replace(/^(\d+)-(\d+)-(\d+)$/, '$3-$2-$1');
            releaseDate.innerHTML = x;
            releaseDate.classList.add("h6", "h-50", "d-flex", "align-items-end");
            cardBodyDiv.append(releaseDate);
        }

        parentElement.append(cardDiv);
    });
}