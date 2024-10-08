import React, {useState} from "react";
import SearchBar from "../components/SearchBar";
import axiosInstance from "../utils/AxiosInstance";
import { useMessageContext } from "../context/MessageContext";
import CustomError from "../error/CustomError";
import useProfile from "../hooks/useProfile";

export default function Search() {
    const { updateMessage } = useMessageContext();
    const profile = useProfile();
    const [movies, setMovies] = useState([]);
    const [tmdbMovieId, setTmdbMovieId] = useState("");
    const [isRatingPopupVisible, setIsRatingPopupVisible] = useState(false);

    // open or close box to allow user to rate the movie
    const toggleRatingPopup = (tmdbMovieId = null) => {
        setTmdbMovieId(tmdbMovieId);
        setIsRatingPopupVisible((currentState) => !currentState); // get the current state (visible or not-visible) and set it to the opposite
    };

    const handleMovieSearchRequest = async (path, params, query) => {
        updateMessage('Getting movies...', true);

        try {
            if (!query) {
                updateMessage('No search query found. Please contact your admin.', false);
                return;
            }

            console.log(params);
            // Use axiosInstance to make the request with specified path and params
            const response = await axiosInstance.get(path, {
                params
            });

            let foundMovies = response.data;

            if (!foundMovies || !Array.isArray(foundMovies) || !foundMovies.length) {
                setMovies([]);
                updateMessage("There were no movies found in this search. Give it another go!", false);
            } else {
                setMovies(foundMovies); // Movies found, populate list
                updateMessage("Movies found", true);
            }

        } catch (error) {
            console.log("There was an error executing the search for movies - " + error);
            updateMessage(error.message, false);
        }
    };

    return (
        <div className="search-page">
            <SearchBar
                handleSearch={(query) => handleMovieSearchRequest(
                    '/tmdb/search/moviesByTitle',
                    { movieTitle: query },
                    query
                )}
            />
            <div className="search-favourites">
                <button
                    type="button"
                    onClick={() => handleMovieSearchRequest(
                        '/tmdb/search/moviesByParams',
                        {primary_release_year: String(profile.favouriteReleaseYear)},
                        profile.favouriteReleaseYear
                    )}
                    className="search-button-favourites"
                >
                    Release year: {profile.favouriteReleaseYear}
                </button>
                <button
                    type="button"
                    onClick={() => handleMovieSearchRequest(
                        '/tmdb/search/moviesByParams',
                        {with_genres: String(profile.favouriteGenre.id)},
                        profile.favouriteGenre.id
                    )}
                    className="search-button-favourites"
                >
                    Genre: {profile.favouriteGenre.name}
                </button>
                <button
                    type="button"
                    onClick={() => handleMovieSearchRequest(
                        '/tmdb/search/popular-movies',
                        null,
                        "Popular",
                    )}
                    className="search-button-favourites"
                >
                    Popular movies
                </button>
            </div>

            {movies.length > 0 && (
                <div id="searchResultsGrid">
                    {movies.map(({id, ...movie}) => (
                        <MovieBox
                            key={id}
                            movie={movie}
                            openRatingPopup={() => toggleRatingPopup(id)}
                        />
                    ))}
                </div>
            )}

            {isRatingPopupVisible && (
                <PopupRatingBox
                    tmdbMovieId={tmdbMovieId}
                    closeRatingPopup={() => toggleRatingPopup(null)}
                />
            )}
        </div>
    );
}

function MovieBox({movie, openRatingPopup}) {
    const posterPath =
        "https://image.tmdb.org/t/p/w500" + movie.poster_path;

    return (
        <div className="movie-box">
            <div
                className="movie-box-poster"
                style={{
                    backgroundImage: `url(${posterPath})`,
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
    const [movieRating, setMovieRating] = useState(5);
    const { updateMessage } = useMessageContext();

    const handleSubmitMovieRating = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post(`/user/movies/add?tmdbMovieId=${tmdbMovieId}&rating=${movieRating}`, null, {
                headers: {
                    accept: 'application/json'
                },
            });

            if (response.status === 200) {
                console.log('Successful attempt: ', response);
                updateMessage("Movie added to your list successfully!", true);
                closeRatingPopup();
            }
        } catch (error) {
            // Check if the error is an instance of CustomError
            if (error instanceof CustomError) {
                updateMessage(error.message, false);
            } else if (error.response) {
                // Handle standard Axios errors
                updateMessage('Unexpected error: ' + error.response.status + ' ' + error.response.data, false);
            } else {
                // Handle network errors or unknown issues
                updateMessage('Unexpected error: ' + error.message, false);
            }
            closeRatingPopup();
        }
    }

    return (
        <div id="myModal" className="modal">
            <div className="modal-content">
                <form id="ratingForm" onSubmit={handleSubmitMovieRating}>
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
                        value={movieRating}
                        onChange={(e) => setMovieRating(Number(e.target.value))}
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
