import React, { useEffect, useState } from "react";
import axiosInstance from "../components/AxiosInstance";
import {Link} from "react-router-dom";
import {useErrorContext} from "../context/ErrorContext";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const { updateMessage } = useErrorContext();

  // Fetch movie connections
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosInstance.get("/user/movies/");

        if (response.status === 200 || response.status === 204) {
          setMovies(response.data);
        } else {
          console.error("Failed to fetch movies");
          updateMessage("Failed to fetch movies.", false);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        updateMessage("An error occurred while fetching the movie list: " + error.message, false);
      }
    };

    fetchMovies();
  }, []);


  // Handle rating update
  const handleRatingBlur = async (movieConnectionId, updatedRating) => {
    try {
      const params = new URLSearchParams();
      params.append("rating", updatedRating);

      const response = await axiosInstance.post(
          `/user/movies/${movieConnectionId}/edit-rating`,
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
      );

      if (response.status === 200) {
        // Update the movie's rating locally
        const updatedMovies = movies.map((movie) =>
            movie.movie_connection_id === movieConnectionId
                ? { ...movie, rating: updatedRating }
                : movie
        );

        // Sort movies by rating in descending order
        updatedMovies.sort((a, b) => b.rating - a.rating);

        // Update state with sorted movies
        setMovies(updatedMovies);
        updateMessage("Movie rating succesfully updated", true);
      }
    } catch (error) {
      console.error("Error updating movie rating:", error);
      updateMessage(error.message, false);
    }
  };

  // Handle movie deletion
  const handleDeleteMovie = async (movieId) => {
    try {
      const response = await axiosInstance.delete(`/user/movies/${movieId}/remove`, {
        headers: {
          accept: 'application/json'
        },
      });


      if (response.status === 200) {
        setMovies(movies.filter((movie) => movie.movie.movie_id !== movieId));
        updateMessage("Movie deleted!", true);
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      updateMessage("An error occurred while deleting the movie. Contact your administrator.", false);
    }
  };

  return (
      <div className="content">

        {movies.length === 0 ? (
            <div>
              <p>No movies found in your list. Add some <Link to="/search">here</Link>.</p>
            </div>
        ) : (
            movies.map((movieConnection) => (
                <div className="movie-card" key={movieConnection.movie_connection_id}>
                  <div className="text-content">
                    <div className="top-content">
                      <input
                          type="number"
                          value={movieConnection.rating}
                          min="0"
                          max="10"
                          step="0.1"
                          className="editable-rating"
                          onBlur={(e) =>
                              handleRatingBlur(
                                  movieConnection.movie_connection_id,
                                  e.target.value
                              )
                          }
                          onChange={(e) => {
                            const updatedMovies = movies.map((movie) =>
                                movie.movie_connection_id === movieConnection.movie_connection_id
                                    ? { ...movie, rating: e.target.value }
                                    : movie
                            );
                            setMovies(updatedMovies);
                          }}
                          required
                      />
                      <p>|</p>
                      <h4>{movieConnection.movie.release_date}</h4>
                      <p>|</p>
                      <button
                          onClick={() => handleDeleteMovie(movieConnection.movie.movie_id)}
                          className="btn btn-delete"
                      >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <h2 className="movie-title">{movieConnection.movie.title}</h2>
                    <h4>{movieConnection.movie.tagline}</h4>
                    <p>{movieConnection.movie.overview}</p>
                  </div>
                  <div
                      className="image-content"
                      style={{
                        backgroundImage: `url(${movieConnection.movie.backdrop_path})`,
                      }}
                  ></div>
                </div>
            ))
        )}
      </div>
  );

}
