import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Movie() {
  const { movieID } = useParams();

  const [movie, setMovie] = useState([]);

  useEffect(() => {
    async function getSimilarMovies(pageNumber) {
      console.log(`running`);
      const dbCall = await axios({
        url: `https://api.themoviedb.org/3/movie/${movieID}/similar`,
        method: "GET",
        dataResponse: "json",
        params: {
          api_key: "686f4b568f616a8066ae90d21c06dffe",
          page: pageNumber,
        },
      });
      const movieResults = await dbCall;
      return movieResults;
    }

    getSimilarMovies();

    const promiseArray = [];
    const newArray = [];

    for (let i = 1; i <= 5; i++) {
      newArray.push(getSimilarMovies(i));
    }

    Promise.all(newArray).then((allResponses) => {
      allResponses.forEach((response) => {
        //use spread operator to make it into a big array of 100 films for filter
        promiseArray.push(...response.data.results);
      });

      //filter on foreginMovies
      const foreignMovies = promiseArray.filter(
        (movie) => movie.original_language !== "en"
      );
      setMovie(foreignMovies);
    });
  }, [movieID]);

  // props no longer needed to pass into .map since state is directly being passed
  return (
    <section className="movieContainer">
      <ul>
        {movie.map(function (currentMovie) {
          return (
            <li key={currentMovie.id}>
              <div className="textContainer">
                <h2>{currentMovie.title}</h2>
                <p>Language: {currentMovie.original_language}</p>
              </div>
              <div className="imgContainer">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${currentMovie.poster_path}`}
                  alt={`Poster for '${currentMovie.title}'`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Movie;
