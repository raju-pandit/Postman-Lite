const express = require("express");
const cors = require("cors");
const path = require("path");
const proxyRoute = require("./routes/proxy");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend")));

// ── Proxy Route ──
app.use("/proxy", proxyRoute);

// ══════════════════════════════════════════
//  DEMO API ENDPOINTS (Full CRUD for Testing)
// ══════════════════════════════════════════

// In-memory database for demo (50 movies)
let movies = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Movie Title ${i + 1}`,
  year: 2000 + (i % 25),
  genre: ["Action", "Sci-Fi", "Drama", "Comedy", "Thriller", "Horror"][i % 6],
  rating: parseFloat(((Math.random() * 4) + 6).toFixed(1)), // random 6.0 to 9.9
  director: `Director ${i + 1}`
}));

// Overwrite first few to keep familiar favorites
movies[0] = { id: 1, title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: 8.7, director: "Christopher Nolan" };
movies[1] = { id: 2, title: "The Dark Knight", year: 2008, genre: "Action", rating: 9.0, director: "Christopher Nolan" };
movies[2] = { id: 3, title: "Inception", year: 2010, genre: "Sci-Fi", rating: 8.8, director: "Christopher Nolan" };
movies[3] = { id: 4, title: "3 Idiots", year: 2009, genre: "Comedy", rating: 8.4, director: "Rajkumar Hirani" };
movies[4] = { id: 5, title: "Dangal", year: 2016, genre: "Drama", rating: 8.3, director: "Nitesh Tiwari" };

let nextId = 51;

// 1. GET /movies — Get all movies
app.get("/movies", (req, res) => {
  res.json({
    status: "success",
    count: movies.length,
    data: movies
  });
});

// 2. GET /movies/:id — Get single movie
app.get("/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json({ status: "success", data: movie });
});

// 3. POST /movies — Create a new movie
app.post("/movies", (req, res) => {
  const { title, year, genre, rating, director } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  
  const newMovie = {
    id: nextId++,
    title,
    year: year || new Date().getFullYear(),
    genre: genre || "Unknown",
    rating: rating || 0,
    director: director || "Unknown"
  };
  
  movies.push(newMovie);
  res.status(201).json({ status: "success", message: "Movie created successfully", data: newMovie });
});

// 4. PUT /movies/:id — Completely replace a movie
app.put("/movies/:id", (req, res) => {
  const index = movies.findIndex((m) => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Movie not found" });

  const { title, year, genre, rating, director } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required for PUT" });

  const updatedMovie = {
    id: parseInt(req.params.id),
    title,
    year: year || movies[index].year,
    genre: genre || movies[index].genre,
    rating: rating || movies[index].rating,
    director: director || movies[index].director
  };

  movies[index] = updatedMovie;
  res.json({ status: "success", message: "Movie replaced completely", data: updatedMovie });
});

// 5. PATCH /movies/:id — Partially update a movie
app.patch("/movies/:id", (req, res) => {
  const index = movies.findIndex((m) => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Movie not found" });

  const updates = req.body;
  // Don't allow changing the ID
  delete updates.id;

  movies[index] = { ...movies[index], ...updates };
  res.json({ status: "success", message: "Movie updated partially", data: movies[index] });
});

// 6. DELETE /movies/:id — Delete a movie
app.delete("/movies/:id", (req, res) => {
  const index = movies.findIndex((m) => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Movie not found" });

  const deletedMovie = movies.splice(index, 1);
  res.json({ status: "success", message: "Movie deleted successfully", data: deletedMovie[0] });
});

// Generate 50 Users for Demo
const demoUsers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User Name ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["admin", "user", "editor", "moderator"][i % 4]
}));

// Overwrite first few
demoUsers[0] = { id: 1, name: "Raju Pandit", email: "raju@example.com", role: "admin" };
demoUsers[1] = { id: 2, name: "Priya Sharma", email: "priya@example.com", role: "user" };

// GET /users — Demo users
app.get("/users", (req, res) => {
  res.json({
    status: "success",
    count: demoUsers.length,
    data: demoUsers
  });
});

// GET /api/status — Health check
app.get("/api/status", (req, res) => {
  res.json({
    status: "OK",
    message: "Postman Lite Server is running!",
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📡 Full CRUD Demo APIs ready:`);
  console.log(`   GET    /movies`);
  console.log(`   GET    /movies/:id`);
  console.log(`   POST   /movies`);
  console.log(`   PUT    /movies/:id`);
  console.log(`   PATCH  /movies/:id`);
  console.log(`   DELETE /movies/:id`);
  console.log(`   GET    /users`);
  console.log(`   GET    /api/status`);
});
