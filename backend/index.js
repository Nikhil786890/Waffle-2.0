import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

app.get("/openlibrary", async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) return res.status(400).json({ error: "Query is missing" });

  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`);
    const data = await response.json();
    const simplified = data.docs.map((item) => item.title);
    res.json(simplified);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from Open Library" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}.`));
