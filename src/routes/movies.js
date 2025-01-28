import { Router } from "express";
import movies from "../../assets/movies.json" with { type: "json" };
import { validateMovie, validatePartialMovie } from "../schemas/movie.js";
import { randomUUID } from "node:crypto";

const moviesRouter = Router();

moviesRouter.get("/", (req, res) => {
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

moviesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const exist = movies.find((movie) => movie.id === id);
  if (exist) {
    res.json(exist);
  } else {
    res.status(404).json({ message: "Movie not found" });
  }
});

moviesRouter.post("/", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    res.status(400).json({ message: result.error.errors });
    return;
  }

  const newMovie = {
    id: randomUUID(),
    ...req.body,
  };

  push(newMovie);
  res.status(201).json(newMovie);
});

moviesRouter.patch("/:id", (req, res) => {
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

export default moviesRouter;