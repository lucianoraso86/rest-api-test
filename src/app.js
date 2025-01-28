const express = require("express");
const crypto = require("node:crypto");
const z = require("zod");
const cors = require("cors");
const movies = require("../assets/movies.json");
const { validateMovie, validatePartialMovie } = require("../schemas/movie");

const PORT = process.env.PORT || 4000;

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "I'ts works!" });
});

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    console.log(genre);
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLocaleLowerCase() === genre.toLocaleLowerCase())
    );
    res.json(filteredMovies);
  } else {
    res.json(movies);
  }
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const exist = movies.find((movie) => movie.id === id);
  if (exist) {
    res.json(exist);
  } else {
    res.status(404).json({ message: "Movie not found" });
  }
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    res.status(400).json({ message: result.error.errors });
    return;
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...req.body,
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);
  
  if (result.error) {
    res.status(400).json({ message: result.error.errors });
    return;
  }
  
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    res.status(404).json({ message: "Movie not found" });
    return;
  }

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data,
  };  

  movies[movieIndex] = updatedMovie;

  res.json(updatedMovie);


});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
