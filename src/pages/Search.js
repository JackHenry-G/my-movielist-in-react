import React, {useEffect, useState} from "react";
import SearchBar from "../components/SearchBar";
import axiosInstance from "../components/AxiosInstance";
import {fetchProfileData} from "../services/profileService";

export default function Search() {
    const [movies, setMovies] = useState([]);
    const [tmdbMovieId, setTmdbMovieId] = useState("");
    const [isRatingPopupVisible, setIsRatingPopupVisible] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setIsLoading] = useState(false);
    const [favouriteReleaseYear, setFavouriteReleaseYear] = useState("");

    // open or close box to allow user to rate the movie
    const toggleRatingPopup = (tmdbMovieId = null) => {
        setTmdbMovieId(tmdbMovieId);
        setIsRatingPopupVisible((currentState) => !currentState); // get the current state (visible or not-visible) and set it to the opposite
    };

    const handleMovieSearchRequest = async (path, params, query) => {
        setIsLoading(true);
        setError(null); // Clear previous errors

        try {
            if (!query) {
                setError('No favourite found. Please contact your admin.');
                return;
            }

            // Use axiosInstance to make the request with specified path and params
            const response = await axiosInstance.get(path, {
                params
            });

            let foundMovies = response.data;

            if (!foundMovies || !Array.isArray(foundMovies) || !foundMovies.length) {
                setMovies([]);
                setError("There were no movies found in this search. Give it another go!");
            } else {
                setError('');
                setMovies(foundMovies); // Movies found, populate list
            }

        } catch (error) {
            console.log("There was an error executing the search for movies - " + error);
            setError("There has been a problem. Please try again or contact your admin.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const data = await fetchProfileData(); // Call the utility function
                setFavouriteReleaseYear(data.favouriteReleaseYear);
            } catch (err) {
                console.error("Failed to fetch profile data:", err.message);
                setError(err.message);
            }
        };

        getProfileData();
    }, []); // The empty dependency array ensures this runs only once and when the component mounts. Rather than everytime a dependency (variable) changes through state


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
                        '/tmdb/search/moviesByReleaseYear',
                        { releaseYear: String(favouriteReleaseYear) },
                        favouriteReleaseYear
                    )}
                    className="search-button-favourites"
                >
                    {favouriteReleaseYear}
                </button>
                <button
                    type="button"
                    className="search-button-favourites"
                >
                    *WIP BUTTON*
                </button>
                <button
                    type="button"
                    className="search-button-favourites"
                >
                    *WIP BUTTON*
                </button>
                <button
                    type="button"
                    className="search-button-favourites"
                >
                    *WIP BUTTON*
                </button>
                <button
                    type="button"
                    className="search-button-favourites"
                >
                    *WIP BUTTON*
                </button>
                <button
                    type="button"
                    className="search-button-favourites"
                >
                    *WIP BUTTON*
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


            {loading && (
                <div className="loading-container">
                    <p>Movies are loading...</p>
                </div>
            )}

            {error && <p style={{color: 'red'}}>{error}</p>}

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
                alert("Movie added to your list successfully!");
                closeRatingPopup();
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    alert(error.response.data || "Movie was not added! This movie already exists in your list.");
                } else {
                    alert("There has been an error adding a movie to your list. Contact your admin!");
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
                alert("No response received from the server. Please try again later.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error setting up request:", error.message);
                alert("An unexpected error occurred. Please try again later.");
            }
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
