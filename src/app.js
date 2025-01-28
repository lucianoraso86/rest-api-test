import express, { json } from "express";

import moviesRouter from "./routes/movies.js";
import corsMiddleware from "./middlewares/cors.js";

const PORT = process.env.PORT || 4000;

const app = express();
app.disable("x-powered-by");
app.use(json());
app.use(corsMiddleware());

app.get("/", (req, res) => res.json({ message: "API I'ts works!" }));

app.use("/movies", moviesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
