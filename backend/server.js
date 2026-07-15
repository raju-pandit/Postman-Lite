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
//  DEMO API ENDPOINTS (Test karne ke liye)
// ══════════════════════════════════════════

// GET /movies — All movies
app.get("/movies", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Interstellar",
      year: 2014,
      genre: "Sci-Fi",
      rating: 8.7,
      director: "Christopher Nolan",
    },
    {
      id: 2,
      title: "The Dark Knight",
      year: 2008,
      genre: "Action",
      rating: 9.0,
      director: "Christopher Nolan",
    },
    {
      id: 3,
      title: "Inception",
      year: 2010,
      genre: "Sci-Fi",
      rating: 8.8,
      director: "Christopher Nolan",
    },
    {
      id: 4,
      title: "3 Idiots",
      year: 2009,
      genre: "Comedy",
      rating: 8.4,
      director: "Rajkumar Hirani",
    },
    {
      id: 5,
      title: "Dangal",
      year: 2016,
      genre: "Drama",
      rating: 8.3,
      director: "Nitesh Tiwari",
    },
    {
      id: 6,
      title: "Baahubali 2",
      year: 2017,
      genre: "Action",
      rating: 8.2,
      director: "S.S. Rajamouli",
    },
    {
      id: 7,
      title: "KGF Chapter 2",
      year: 2022,
      genre: "Action",
      rating: 8.3,
      director: "Prashanth Neel",
    },
    {
      id: 8,
      title: "RRR",
      year: 2022,
      genre: "Action",
      rating: 7.9,
      director: "S.S. Rajamouli",
    },
  ]);
});

// GET /movies/:id — Single movie
app.get("/movies/:id", (req, res) => {
  const movies = [
    {
      id: 1,
      title: "Interstellar",
      year: 2014,
      genre: "Sci-Fi",
      rating: 8.7,
      director: "Christopher Nolan",
    },
    {
      id: 2,
      title: "The Dark Knight",
      year: 2008,
      genre: "Action",
      rating: 9.0,
      director: "Christopher Nolan",
    },
    {
      id: 3,
      title: "Inception",
      year: 2010,
      genre: "Sci-Fi",
      rating: 8.8,
      director: "Christopher Nolan",
    },
    {
      id: 4,
      title: "3 Idiots",
      year: 2009,
      genre: "Comedy",
      rating: 8.4,
      director: "Rajkumar Hirani",
    },
    {
      id: 5,
      title: "Dangal",
      year: 2016,
      genre: "Drama",
      rating: 8.3,
      director: "Nitesh Tiwari",
    },
  ];
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json(movie);
});

// POST /movies — Add movie (demo)
app.post("/movies", (req, res) => {
  const { title, year, genre, rating, director } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  res.status(201).json({
    id: Date.now(),
    title,
    year: year || 2024,
    genre: genre || "Unknown",
    rating: rating || 0,
    director: director || "Unknown",
    message: "Movie added successfully! (demo)",
  });
});

// GET /users — Demo users
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Raju Pandit", email: "raju@example.com", role: "admin" },
    { id: 2, name: "Priya Sharma", email: "priya@example.com", role: "user" },
    { id: 3, name: "Amit Kumar", email: "amit@example.com", role: "user" },
    { id: 4, name: "Sneha Gupta", email: "sneha@example.com", role: "editor" },
  ]);
});

// GET /api/status — Health check
app.get("/api/status", (req, res) => {
  res.json({
    status: "OK",
    message: "Postman Lite Server is running!",
    time: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📡 Demo APIs ready:`);
  console.log(`   GET  /movies`);
  console.log(`   GET  /movies/:id`);
  console.log(`   POST /movies`);
  console.log(`   GET  /users`);
  console.log(`   GET  /api/status`);
});
