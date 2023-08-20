import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-f4d83-default-rtdb.firebaseio.com/movies.json');    //here using fetch api we get the data from our database
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      console.log(data);

      const loadedMovies = []; // step-1 : for rendering the data in the page

      for(const key in data){ //step-2
          loadedMovies.push({
            id:key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate,

          })
      };

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {  //here using fetch api we post data to our database
    const response = await fetch("https://react-http-f4d83-default-rtdb.firebaseio.com/movies.json",{
      method: 'POST',           //here by default this METHOD takes GET
      body: JSON.stringify(movie), //JSON.stringify(), we can't give an object or array as resource it only takes in JSON. so using this we convert the js Object or Array in to JSON format.
      headers: {
          'Content-Type': 'application/json'
      }
    });
    const data = response.json();   // here this is bcoz that firebase also sends requests in json format
    console.log(data);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
