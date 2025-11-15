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
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`
    );

    const data = await response.json();

    const simplified = data.docs
      .filter((item) => item.title)
      .map((item) => {
        // Priority 1: work key
        let link =
          item.key ||
          (item.work_key?.[0]
            ? item.work_key[0]
            : item.edition_key?.[0]
            ? `/books/${item.edition_key[0]}`
            : null);

        return {
          title: item.title,
          key: link
        };
      })
      .filter((item) => item.key); // remove any null results

    console.log("RESULT:", simplified.slice(0, 5));

    res.json(simplified);
  } catch (err) {
    console.error("Error fetching from OpenLibrary:", err);
    res.status(500).json({ error: "Failed to fetch from Open Library" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}.`));
