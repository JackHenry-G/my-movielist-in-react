import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Search() {
  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      handleSearch(query);
    }
  };

  const handleSearch = (query) => {
    // mimic api call
    const dummyData = [
      {
        movie_id: 230426,
        title: "Hunger Games",
        releaseYear: "2010-10-02",
        runtime: 128,
        tagline: "May the odds be ever in your favour",
        genre: "Action",
        backdrop_path: "/yDbyVT8tTOgXUrUXNkHEUqbxb1K.jpg",
        poster_path:
          "https://image.tmdb.org/t/p/w500/yXCbOiVDCxO71zI7cuwBRXdftq8.jpg",
        overview:
          "Every year in the ruins of what was once North America, the nation of Panem forces each of its twelve districts to send a teenage boy and girl to compete in the Hunger Games.  Part twisted entertainment, part government intimidation tactic, the Hunger Games are a nationally televised event in which “Tributes” must fight with one another until one survivor remains.  Pitted against highly-trained Tributes who have prepared for these Games their entire lives, Katniss is forced to rely upon her sharp instincts as well as the mentorship of drunken former victor Haymitch Abernathy.  If she’s ever to return home to District 12, Katniss must make impossible choices in the arena that weigh survival against humanity and life against love. The world will be watching.",
      },
      {
        movie_id: 230418,
        title: "La La Land",
        releaseYear: "2015-10-02",
        runtime: 192,
        tagline: "City of stars",
        genre: "Romance",
        backdrop_path: "/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg",
        poster_path:
          "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
        overview:
          "Mia, an aspiring actress, serves lattes to movie stars in between auditions and Sebastian, a jazz musician, scrapes by playing cocktail party gigs in dingy bars, but as success mounts they are faced with decisions that begin to fray the fragile fabric of their love affair, and the dreams they worked so hard to maintain in each other threaten to rip them apart.",
      },
    ];

    const matchedData = dummyData.filter((result) =>
      result.title.includes(query)
    );

    setData(matchedData);
  };

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const [tmdbMovieId, setTmdbMovieId] = useState("");

  const showRatingPopup = (tmdbMovieId) => {
    setTmdbMovieId(tmdbMovieId);
    setIsPopupVisible(true);
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="search-page">
      <div className="search-bar">
        <input
          className="search-term"
          id="movies-search-bar"
          type="text"
          placeholder="Search for your favourite movies..."
          value={query}
          onChange={handleChange}
          onKeyUp={handleEnter}
        />
        <button className="search-button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {data.map((result) => (
        <div className="movie-box" key={result.id}>
          <div
            className="movie-box-poster"
            style={{
              backgroundImage: `url(${result.poster_path})`,
              height: "500px",
              width: "300px",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <div className="movie-box-text">
            <p>{result.title}</p>
            <p>{result.year}</p>

            <div className="movie-box-add">
              <a
                href="javascript:void(0)"
                onClick={() => showRatingPopup(result.id)}
                className="add-movie-button"
              >
                I just watched this!
              </a>
            </div>
          </div>
        </div>
      ))}

      {isPopupVisible && (
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
              <button type="button" onClick={closePopup}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
