"use client";

import { useState } from "react";
import axios from "axios";
import { analyzePosts, computeOverallVibe } from "@/lib/sentimentUtils";

const SUGGESTIONS = ["reactjs", "programming", "technology", "wallstreetbets", "aww"];

const LABEL_STYLES = {
  Positive: "bg-green-100 text-green-700 border-green-300",
  Neutral: "bg-gray-100 text-gray-700 border-gray-300",
  Negative: "bg-red-100 text-red-700 border-red-300",
};

export default function Home() {
  const [subreddit, setSubreddit] = useState("");
  const [posts, setPosts] = useState([]);
  const [vibe, setVibe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchedName, setSearchedName] = useState("");

  async function fetchSubreddit(name) {
    const target = (name ?? subreddit).trim();
    if (!target) {
      setError("Enter a subreddit name first.");
      return;
    }

    setLoading(true);
    setError("");
    setPosts([]);
    setVibe(null);

    try {
      const res = await axios.get(`/api/subreddit/${encodeURIComponent(target)}`);
      const analyzed = analyzePosts(res.data.posts);
      setPosts(analyzed);
      setVibe(computeOverallVibe(analyzed));
      setSearchedName(res.data.subreddit);
    } catch (err) {
      const message =
        err.response?.data?.error ?? "Failed to fetch subreddit. Check your connection.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetchSubreddit();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">The Subreddit Vibe Check</h1>
        <p className="mt-1 text-slate-500">
          Enter a subreddit to analyze the sentiment of its 50 hottest post titles.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <input
            type="text"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
            placeholder="e.g. reactjs"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-5 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check Vibe"}
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSubreddit(s);
                fetchSubreddit(s);
              }}
              className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
            >
              r/{s}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-10 flex flex-col items-center gap-3 text-slate-500">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800" />
            <p>Fetching r/{subreddit} and analyzing 50 titles...</p>
          </div>
        )}

        {!loading && vibe && (
          <>
            <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">
                Overall vibe of r/{searchedName}
              </h2>
              <p className="mt-1 text-4xl font-bold text-slate-900">{vibe.label}</p>
              <p className="mt-1 text-sm text-slate-500">
                Average sentiment score: {vibe.avgComparative}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-green-50 py-3">
                  <p className="text-2xl font-semibold text-green-700">{vibe.positive}</p>
                  <p className="text-xs text-green-600">Positive</p>
                </div>
                <div className="rounded-lg bg-gray-50 py-3">
                  <p className="text-2xl font-semibold text-gray-700">{vibe.neutral}</p>
                  <p className="text-xs text-gray-600">Neutral</p>
                </div>
                <div className="rounded-lg bg-red-50 py-3">
                  <p className="text-2xl font-semibold text-red-700">{vibe.negative}</p>
                  <p className="text-xs text-red-600">Negative</p>
                </div>
              </div>
            </section>

            <section className="mt-6 space-y-3">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-slate-800">{post.title}</p>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${LABEL_STYLES[post.sentiment.label]}`}
                    >
                      {post.sentiment.label}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-slate-400">
                    <span>u/{post.author}</span>
                    <span>{post.score} upvotes</span>
                    <span>{post.numComments} comments</span>
                    <span>score: {post.sentiment.comparative}</span>
                  </div>
                </a>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}