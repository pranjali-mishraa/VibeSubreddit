VibeSubreddit

A simple Next.js dashboard that checks the overall sentiment of a subreddit by analyzing the titles of its 50 hottest posts.

Features
Search for a subreddit
Fetch 50 hot posts
Analyze post titles using sentiment analysis
Classify posts as Positive, Neutral, or Negative
Calculate the overall subreddit vibe
Display post scores and comments
Handle invalid or unavailable subreddits

Tech Stack
Next.js
React
Tailwind CSS
Axios
Sentiment.js

Reddit API Note

Reddit API access was requested for this internship assignment, but the request was not approved by Reddit. The project therefore uses Reddit's publicly accessible JSON endpoint for development/testing.

The Reddit data-fetching logic is isolated in the Next.js API route, so it can be updated to use an authorized Reddit API integration if access is granted in the future.
