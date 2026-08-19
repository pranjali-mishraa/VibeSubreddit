import Sentiment from "sentiment";

const analyzer = new Sentiment();

// Classify a single title.
// `comparative` is score normalized by word count, which is fairer
// across short and long titles than raw score.
export function analyzeTitle(title) {
  const result = analyzer.analyze(title);

  let label = "Neutral";
  if (result.comparative > 0.15) label = "Positive";
  else if (result.comparative < -0.15) label = "Negative";

  return {
    score: result.score,
    comparative: Number(result.comparative.toFixed(3)),
    label,
    positiveWords: result.positive,
    negativeWords: result.negative,
  };
}

// Attach sentiment to every post.
export function analyzePosts(posts) {
  return posts.map((post) => ({
    ...post,
    sentiment: analyzeTitle(post.title),
  }));
}

// Roll everything up into one overall subreddit vibe.
export function computeOverallVibe(analyzedPosts) {
  if (analyzedPosts.length === 0) {
    return { label: "Neutral", avgComparative: 0, positive: 0, neutral: 0, negative: 0 };
  }

  const counts = { Positive: 0, Neutral: 0, Negative: 0 };
  let totalComparative = 0;

  for (const post of analyzedPosts) {
    counts[post.sentiment.label]++;
    totalComparative += post.sentiment.comparative;
  }

  const avgComparative = totalComparative / analyzedPosts.length;

  let label = "Neutral 😐";
  if (avgComparative > 0.15) label = "Positive 🙂";
  else if (avgComparative < -0.15) label = "Negative 🙁";

  return {
    label,
    avgComparative: Number(avgComparative.toFixed(3)),
    positive: counts.Positive,
    neutral: counts.Neutral,
    negative: counts.Negative,
  };
}