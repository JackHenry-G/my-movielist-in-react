import { useState } from "react";
import SearchBar from "../components/SearchBar";
import axios from 'axios';

export default function Search() {
  const [movies, setMovies] = useState([]);
  const [tmdbMovieId, setTmdbMovieId] = useState("");
  const [isRatingPopupVisible, setIsRatingPopupVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(false);

  // open or close box to allow user to rate the movie
  const toggleRatingPopup = (tmdbMovieId = null) => {
    setTmdbMovieId(tmdbMovieId);
    setIsRatingPopupVisible((prevState) => !prevState);
  };

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null); // clear previous errors


      const url = `http://localhost:8080/search/moviesByTitle?movieTitle=${encodeURIComponent(query)}`;
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxY2ZlZDIxNjQ2NjY2Yzk5YjNlZjA2NDZlMjg5MTFkYyIsInN1YiI6IjY1NWZhMzQ5NzA2ZTU2MDEzOGMyMDk2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vgOOTsReFyIncA0dEgC-LmyvvsniZrHQW7n0reCUPvc';

      try {
        console.log("1");
        const response = await axios.get(url, {
            headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${token}`,
            },
        });
        console.log("2");

        console.log(response);
        setMovies(response.data.results);
    } catch (error) {
        setError("There has been a problem - " + error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <SearchBar
        handleSearch={handleSearch}
      />


      {movies.map((movie) => (
        <MovieBox
            key={movie.id}
            movie={movie}
            openRatingPopup={() => toggleRatingPopup(movie.id)}
        />
      ))}

        {loading && (
            <div className="loading-container">
                <p>Movies are loading...</p>
            </div>
        )}

        {error && (
            <div className="error-container">
                <p>{error}</p>
            </div>
        )}

      {isRatingPopupVisible && (
        <PopupRatingBox
          tmdbMovieId={tmdbMovieId}
          closePopup={() => toggleRatingPopup(null)}
        />
      )}
    </div>
  );
}

function MovieBox({movie, openRatingPopup}) {
  return (
      <div className="movie-box">
        <div
            className="movie-box-poster"
            style={{
              backgroundImage: `url(${movie.poster_path})`,
              height: "500px",
              width: "300px",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
        ></div>

        <div className="movie-box-text">
          <p>{movie.title}</p>
          <p>{movie.year}</p>

          <div className="movie-box-add">
            <button
                type="button"
                onClick={openRatingPopup}
                className="add-movie-button"
            >
              I just watched this!
            </button>
          </div>
        </div>
      </div>
  );
}

function PopupRatingBox({tmdbMovieId, closeRatingPopup}) {
  return (
      <div id="myModal" className="modal">
        <div className="modal-content">
          <form id="ratingForm" action="/movies/add" method="post">
            <label htmlFor="rating">
              What would you rate this movie out of 10? (e.g., "Rate as 7,
              8.2, etc.").
            </label>
            <input
                type="number"
                id="rating"
                name="rating"
                min="0"
                max="10"
                step="0.1"
                defaultValue="5"
                required
            />
            <input
                type="hidden"
                id="tmdbMovieId"
                name="tmdbMovieId"
                value={tmdbMovieId}
            />
            <button type="submit">Submit Rating</button>
            <button type="button" onClick={closeRatingPopup}>
              Cancel
            </button>
          </form>
        </div>
      </div>
  );
}
