import axios from "axios";

// Mock example using free sentiment API (example: Twinword API or any other)
export const analyzeSentiment = async (req, res) => {
  try {
    const { reviews } = req.body; // reviews = ["review1", "review2", ...]

    // Combine all reviews into one text
    const text = reviews.join(". ");

    // Using a free sentiment API (Twinword)
    const response = await axios.get(
      `https://twinword-sentiment-analysis.p.rapidapi.com/analyze/`,
      {
        params: { text },
        headers: {
          "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
          "X-RapidAPI-Host": "twinword-sentiment-analysis.p.rapidapi.com",
        },
      }
    );

    const sentimentScore = response.data.score; // Typically -1 to 1

    // Map sentiment score to rating
    let rating = "Average";
    if (sentimentScore > 0.5) rating = "Excellent";
    else if (sentimentScore > 0.1) rating = "Good";
    else if (sentimentScore < -0.5) rating = "Bad";

    res.json({ sentimentScore, rating });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Sentiment analysis failed" });
  }
};
