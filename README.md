# The MovieList Rest API

This front-end has been implemented to interact with a rest api backend - https://github.com/JackHenry-G/MovieListApi - but this front-end interacts with that backend via http requests and provides a GUI for the users to interact with their movielist.

This REST API is designed for managing a list of every movie you have ever watched, the rating out of 10 you gave it and additional thoughts about the movie. 

It is also designed to allow you to search for any movie from 'The Movie Database (tMDB)' service and add any movie to that list.

A cronjob script has also been created to web scrape cinema showtimes and return any flagged movies, from the user's list, showing in a cinema located near to the user. This means you'll never miss a movie you want to see.

A demo application of this has been deployed @ (IN PROGRESS)

## Features

- **User accounts:** Users can create and log into their movielist account.
- **Search Movies:** Users can search for a movie they just watched through the tMDB API.
- **Rate Movies:** Users can then add that movie to their favourite films list by giving it a score out of 10.
- **Ranking System:** Users can see all the movies in their list, ranked in order of highest rating to lowest.
- **Cinema Notifications:** Everyday at midnight a cronjob script will run, which will tell the user if one of their favourite films (>9 rating) is showing in a cinema near them. 

## Technologies

- **Backend:**

  - Spring Boot
  - Java
  - Docker

- **Frontend:**

  - HTML
  - CSS
  - JavaScript
  - REACT

- **Database:**

  - PostgreSQL

- **3rd party APIs:**

  - Google Places API - to search for cinemas near to the user
  - tMDB - movie database to provide data for the app

## Getting started on your local machine

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

This will currently only interact with the backend app running on http://locahost:8080, so make sure that's running too!
